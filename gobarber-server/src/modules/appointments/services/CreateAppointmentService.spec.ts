import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeCacheProvider: FakeCacheProvider;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2023, 8, 1, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2023, 8, 1, 13),
      userId: 'user-id',
      providerId: 'provider-id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerId).toBe('provider-id');
  });

  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2023, 8, 1, 12).getTime();
    });

    const appoitmentDate = new Date(2023, 8, 1, 13);

    await createAppointment.execute({
      date: appoitmentDate,
      userId: 'user-id',
      providerId: 'provider-id',
    });

    await expect(
      createAppointment.execute({
        date: appoitmentDate,
        userId: 'user-id',
        providerId: 'provider-id',
      }),
    ).rejects.toThrowError(
      new AppError('There is already a appointment for this time.'),
    );
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2023, 8, 1, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2023, 8, 1, 11),
        userId: 'user-id',
        providerId: 'provider-id',
      }),
    ).rejects.toThrowError(
      new AppError("You can't create an appointment on a past date."),
    );
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2023, 8, 1, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2023, 8, 1, 13),
        userId: 'user-id',
        providerId: 'user-id',
      }),
    ).rejects.toThrowError(
      new AppError("You can't create an appointment with yourself."),
    );
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2023, 8, 1, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2023, 8, 1, 18),
        userId: 'user-id',
        providerId: 'provider-id',
      }),
    ).rejects.toThrowError(
      new AppError('You can only create appointments between 8am and 5pm.'),
    );

    await expect(
      createAppointment.execute({
        date: new Date(2023, 8, 2, 7),
        userId: 'user-id',
        providerId: 'provider-id',
      }),
    ).rejects.toThrowError(
      new AppError('You can only create appointments between 8am and 5pm.'),
    );
  });
});

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day availability from provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2023, 8, 1, 11).getTime();
    });

    await fakeAppointmentsRepository.create({
      providerId: 'provider',
      userId: 'user',
      date: new Date(2023, 8, 1, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      providerId: 'provider',
      userId: 'user',
      date: new Date(2023, 8, 1, 15, 0, 0),
    });

    const availability = await listProviderDayAvailability.execute({
      providerId: 'provider',
      year: 2023,
      month: 9,
      day: 1,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: true },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
      ]),
    );
  });
});

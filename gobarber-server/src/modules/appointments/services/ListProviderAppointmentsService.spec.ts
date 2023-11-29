import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeCacheProvider: FakeCacheProvider;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the appointments on a specific day from a provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2023, 8, 1, 7).getTime();
    });

    const appointment1 = await fakeAppointmentsRepository.create({
      providerId: 'provider',
      userId: 'user',
      date: new Date(2023, 8, 1, 14, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      providerId: 'provider',
      userId: 'user',
      date: new Date(2023, 8, 1, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      providerId: 'provider',
      year: 2023,
      month: 9,
      day: 1,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});

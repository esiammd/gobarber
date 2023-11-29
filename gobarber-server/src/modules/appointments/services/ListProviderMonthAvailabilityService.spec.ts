import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2023, 8, 1, 7).getTime();
    });

    for (let hour = 8; hour < 18; hour++) {
      await fakeAppointmentsRepository.create({
        providerId: 'provider',
        userId: 'user',
        date: new Date(2023, 8, 1, hour, 0, 0),
      });
    }

    for (let hour = 8; hour < 12; hour++) {
      await fakeAppointmentsRepository.create({
        providerId: 'provider',
        userId: 'user',
        date: new Date(2023, 8, 2, hour, 0, 0),
      });
    }

    const availability = await listProviderMonthAvailability.execute({
      providerId: 'provider',
      year: 2023,
      month: 9,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 1, available: false },
        { day: 2, available: true },
        { day: 3, available: true },
      ]),
    );
  });
});

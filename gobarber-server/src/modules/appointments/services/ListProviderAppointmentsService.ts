import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import type Appointment from '../infra/typeorm/entities/Appointment';
import { instanceToInstance } from 'class-transformer';

interface IRequest {
  providerId: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private readonly appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    providerId,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${providerId}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey,
    );

    if (appointments === null) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          providerId,
          day,
          month,
          year,
        },
      );

      await this.cacheProvider.save(cacheKey, instanceToInstance(appointments));
    }

    return appointments;
  }
}

export default ListProviderAppointmentsService;

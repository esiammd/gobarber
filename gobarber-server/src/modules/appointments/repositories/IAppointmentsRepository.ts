import type ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import type IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import type IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';
import type Appointment from '../infra/typeorm/entities/Appointment';

export default interface IAppointmentsRepository {
  findByDate: (date: Date, providerId: string) => Promise<Appointment | null>;
  findAllInMonthFromProvider: (
    data: IFindAllInMonthFromProviderDTO,
  ) => Promise<Appointment[]>;
  findAllInDayFromProvider: (
    data: IFindAllInDayFromProviderDTO,
  ) => Promise<Appointment[]>;
  create: (data: ICreateAppointmentDTO) => Promise<Appointment>;
}

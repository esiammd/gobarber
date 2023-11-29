import { Raw, type Repository } from 'typeorm';

import type ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import type IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import type IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import type IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { AppDataSource } from '@shared/infra/typeorm';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private readonly ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Appointment);
  }

  public async findByDate(
    date: Date,
    providerId: string,
  ): Promise<Appointment | null> {
    const findAppointment = await this.ormRepository.findOne({
      where: {
        date,
        providerId,
      },
    });

    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    providerId,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parseMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        providerId,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parseMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    providerId,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parseDay = String(day).padStart(2, '0');
    const parseMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        providerId,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parseDay}-${parseMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    });

    return appointments;
  }

  public async create({
    providerId,
    userId,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ providerId, userId, date });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;

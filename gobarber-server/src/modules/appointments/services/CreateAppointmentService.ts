import { injectable, inject } from 'tsyringe';
import { getHours, isBefore, startOfHour, format } from 'date-fns';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import type Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  providerId: string;
  userId: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private readonly appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private readonly notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    providerId,
    userId,
    date,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const cacheKey = `provider-appointments:${providerId}:${format(
      appointmentDate,
      'yyyy-M-d',
    )}`;

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date.");
    }

    if (userId === providerId) {
      throw new AppError("You can't create an appointment with yourself.");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only create appointments between 8am and 5pm.',
      );
    }

    const findAppointmentInSameDate =
      await this.appointmentsRepository.findByDate(appointmentDate, providerId);

    if (findAppointmentInSameDate !== null) {
      throw new AppError('There is already a appointment for this time.');
    }

    const appointment = await this.appointmentsRepository.create({
      providerId,
      userId,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipientId: providerId,
      content: `Novo agendamento para dia ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(cacheKey);

    return appointment;
  }
}

export default CreateAppointmentService;

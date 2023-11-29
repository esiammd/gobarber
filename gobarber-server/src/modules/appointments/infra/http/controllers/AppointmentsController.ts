import { type Request, type Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class Appointmentcontroller {
  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { providerId, date } = request.body;

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      providerId,
      userId,
      date,
    });

    return response.json(appointment);
  }
}

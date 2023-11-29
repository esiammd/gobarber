import { type Request, type Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { instanceToInstance } from 'class-transformer';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const providerId = request.user.id;
    const { day, month, year } = request.query;

    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await listProviderAppointments.execute({
      providerId,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(instanceToInstance(appointments));
  }
}

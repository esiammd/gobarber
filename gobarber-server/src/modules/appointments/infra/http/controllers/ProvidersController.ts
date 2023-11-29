import { type Request, type Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class Providerscontroller {
  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const listProviders = container.resolve(ListProvidersService);

    const providers = await listProviders.execute({
      userId,
    });

    return response.json(instanceToInstance(providers));
  }
}

import { type Request, type Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class UsersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ userId });

    return response.json(instanceToInstance(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { name, email, oldPassword, password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      userId,
      name,
      email,
      oldPassword,
      password,
    });

    return response.json(instanceToInstance(user));
  }
}

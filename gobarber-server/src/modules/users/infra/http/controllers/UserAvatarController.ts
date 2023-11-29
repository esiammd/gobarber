import { type Request, type Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      userId: request.user.id,
      avatarFileName: request.file !== undefined ? request.file.filename : '',
    });

    return response.json(instanceToInstance(user));
  }
}

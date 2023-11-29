import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import type User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  userId: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
  ) {}

  public async execute({ userId, avatarFileName }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar !== null) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const filename = await this.storageProvider.saveFile(avatarFileName);

    user.avatar = filename;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;

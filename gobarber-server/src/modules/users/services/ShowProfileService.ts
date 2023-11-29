import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import type User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  userId: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppError('User not found.');
    }

    return user;
  }
}

export default ShowProfileService;

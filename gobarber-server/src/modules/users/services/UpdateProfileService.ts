import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import type User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  userId: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
  ) {}

  public async execute({
    userId,
    name,
    email,
    oldPassword,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppError('User not found.');
    }

    const userWithUpdateEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdateEmail !== null && userWithUpdateEmail.id !== userId) {
      throw new AppError('Email already in user.');
    }

    if (password !== undefined) {
      if (oldPassword === undefined) {
        throw new AppError(
          'You need to inform the old password to set a new password.',
        );
      }

      const checkOldPassword = await this.hashProvider.compareHash(
        oldPassword,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    user.name = name;
    user.email = email;

    return await this.usersRepository.save(user);
  }
}

export default UpdateProfileService;

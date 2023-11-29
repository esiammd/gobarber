import { type Repository } from 'typeorm';

import type IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import { AppDataSource } from '@shared/infra/typeorm';

import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
  private readonly ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | null> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken;
  }

  public async generate(userId: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      userId,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }
}

export default UserTokensRepository;

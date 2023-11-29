import { injectable, inject } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import type User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  userId: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  public async execute({ userId }: IRequest): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${userId}`,
    );

    if (users === null) {
      users = await this.usersRepository.findAllProviders({
        exceptUserId: userId,
      });

      await this.cacheProvider.save(
        `providers-list:${userId}`,
        instanceToInstance(users),
      );
    }

    return users;
  }
}

export default ListProvidersService;

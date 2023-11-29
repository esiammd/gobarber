import { Not, type Repository } from 'typeorm';

import type ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import type IFindProvidersDTO from '@modules/users/dtos/IFindProvidersDTO';
import type IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { AppDataSource } from '@shared/infra/typeorm';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private readonly ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(User);
  }

  public async findById(id: string): Promise<User | null> {
    const user = await this.ormRepository.findOne({
      where: { id },
    });

    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });

    return user;
  }

  public async findAllProviders({
    exceptUserId,
  }: IFindProvidersDTO): Promise<User[]> {
    let users: User[];

    if (exceptUserId !== undefined) {
      users = await this.ormRepository.find({
        where: {
          id: Not(exceptUserId),
        },
      });
    } else {
      users = await this.ormRepository.find();
    }
    return users;
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ name, email, password });

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    await this.ormRepository.save(user);

    return user;
  }
}

export default UsersRepository;

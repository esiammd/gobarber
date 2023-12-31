import type ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import type IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { v4 as uuid } from 'uuid';

import type IFindProvidersDTO from '@modules/users/dtos/IFindProvidersDTO';
import User from '@modules/users/infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  private readonly users: User[] = [];

  public async findById(id: string): Promise<User | null> {
    const findUser = this.users.find(user => user.id === id);

    return findUser !== undefined ? findUser : null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const findUser = this.users.find(user => user.email === email);

    return findUser !== undefined ? findUser : null;
  }

  public async findAllProviders({
    exceptUserId,
  }: IFindProvidersDTO): Promise<User[]> {
    let users = this.users;

    if (exceptUserId !== undefined) {
      users = this.users.filter(user => user.id !== exceptUserId);
    }

    return users;
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid(), name, email, password });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;

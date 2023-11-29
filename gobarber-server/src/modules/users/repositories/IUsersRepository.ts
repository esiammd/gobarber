import type ICreateUserDTO from '../dtos/ICreateUserDTO';
import type IFindProvidersDTO from '../dtos/IFindProvidersDTO';
import type User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
  findById: (id: string) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  findAllProviders: (data: IFindProvidersDTO) => Promise<User[]>;
  create: (data: ICreateUserDTO) => Promise<User>;
  save: (user: User) => Promise<User>;
}

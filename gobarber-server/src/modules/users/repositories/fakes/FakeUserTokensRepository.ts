import { v4 as uuid } from 'uuid';

import type IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

class FakeUserTokensRepository implements IUserTokensRepository {
  private readonly userTokens: UserToken[] = [];

  public async generate(userId: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | null> {
    const userToken = this.userTokens.find(
      userToken => userToken.token === token,
    );

    return userToken !== undefined ? userToken : null;
  }
}

export default FakeUserTokensRepository;

import { ConnectedUserUsecase } from './connected-user.usecase';
import { UserConnectRequest } from './dto/user.connect.request';
import { Inject, Injectable } from '@nestjs/common';
import {
  REDIS_IO_USER_USECASE,
  RedisIOUserUseCase,
} from '../redis/redis-io-user.usecase';

@Injectable()
export class ConnectedUserService implements ConnectedUserUsecase {
  constructor(
    @Inject(REDIS_IO_USER_USECASE)
    private readonly redisIOUserUseCase: RedisIOUserUseCase,
  ) {}

  async enter(userConnectRequest: UserConnectRequest): Promise<void> {
    const { userId, userNickName } = userConnectRequest;
    await this.redisIOUserUseCase.setHash('userInfo', userId, userNickName);
    await this.redisIOUserUseCase.updateBitMap('inLobby', userId, 1);

    const where = await this.redisIOUserUseCase.checkBitMap(userId);
    await this.redisIOUserUseCase.setHash(
      'onlineUser',
      userId,
      JSON.stringify({
        userNickName,
        where,
      }),
    );
  }

  async enterRoom(userConnectRequest: UserConnectRequest): Promise<void> {
    const { userId, userNickName } = userConnectRequest;
    await this.redisIOUserUseCase.updateBitMap('inRoom', userId, 1);
    const where = await this.redisIOUserUseCase.checkBitMap(userId);

    await this.redisIOUserUseCase.setHash(
      'onlineUser',
      userId,
      JSON.stringify({
        userNickName,
        where,
      }),
    );
  }

  async leave(userId: string): Promise<void> {
    await this.redisIOUserUseCase.updateBitMap('inLobby', userId, 0);
    await this.redisIOUserUseCase.delHash('onlineUser', userId);
  }

  async leaveRoom(userConnectRequest: UserConnectRequest): Promise<void> {
    const { userId, userNickName } = userConnectRequest;
    await this.redisIOUserUseCase.updateBitMap('inRoom', userId, 0);
    const where = await this.redisIOUserUseCase.checkBitMap(userId);

    await this.redisIOUserUseCase.setHash(
      'onlineUser',
      userId,
      JSON.stringify({
        userNickName,
        where,
      }),
    );
  }

  async getOnLineUserList(): Promise<Record<string, string>> {
    return await this.redisIOUserUseCase.getAllHash('onlineUser');
  }
}

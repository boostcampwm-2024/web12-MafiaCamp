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
    const { userId, nickname } = userConnectRequest;
    await this.redisIOUserUseCase.setHash(
      'onlineUser',
      userId,
      JSON.stringify({
        nickname,
        isInLobby: true,
      }),
    );
  }

  async enterRoom(userConnectRequest: UserConnectRequest): Promise<void> {
    const { userId, nickname } = userConnectRequest;
    await this.redisIOUserUseCase.setHash(
      'onlineUser',
      userId,
      JSON.stringify({
        nickname,
        isInLobby: false,
      }),
    );
  }

  async leave(userId: string): Promise<void> {
    await this.redisIOUserUseCase.delHash('onlineUser', userId);
  }

  async leaveRoom(userConnectRequest: UserConnectRequest): Promise<void> {
    const { userId, nickname } = userConnectRequest;
    await this.redisIOUserUseCase.setHash(
      'onlineUser',
      userId,
      JSON.stringify({
        nickname,
        isInLobby: true,
      }),
    );
  }

  async getOnLineUserList(): Promise<Record<string, string>> {
    return await this.redisIOUserUseCase.getAllHash('onlineUser');
  }
}

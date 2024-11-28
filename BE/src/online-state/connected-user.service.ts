import { ConnectedUserUsecase } from './connected-user.usecase';
import { UserConnectRequest } from './dto/user.connect.request';
import { Inject, Injectable } from '@nestjs/common';
import { IO_USER_USECASE, IOUserUseCase } from '../redis/io-user.usecase';

@Injectable()
export class ConnectedUserService implements ConnectedUserUsecase {
  constructor(
    @Inject(IO_USER_USECASE)
    private readonly ioUserUseCase: IOUserUseCase,
  ) {}

  async enter(userConnectRequest: UserConnectRequest): Promise<void> {
    const { userId, nickname } = userConnectRequest;
    await this.ioUserUseCase.setHash(
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
    await this.ioUserUseCase.setHash(
      'onlineUser',
      userId,
      JSON.stringify({
        nickname,
        isInLobby: false,
      }),
    );
  }

  async leave(userId: string): Promise<void> {
    await this.ioUserUseCase.delHash('onlineUser', userId);
  }

  async leaveRoom(userConnectRequest: UserConnectRequest): Promise<void> {
    const { userId, nickname } = userConnectRequest;
    await this.ioUserUseCase.setHash(
      'onlineUser',
      userId,
      JSON.stringify({
        nickname,
        isInLobby: true,
      }),
    );
  }

  async getOnLineUserList(): Promise<Record<string, string>> {
    return await this.ioUserUseCase.getAllHash('onlineUser');
  }
}

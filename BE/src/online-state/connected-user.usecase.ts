import { UserConnectRequest } from './dto/user.connect.request';

export const CONNECTED_USER_USECASE = Symbol('CONNECTED_USER_USECASE');

export interface ConnectedUserUsecase {
  enter(userEnterRequest: UserConnectRequest): Promise<void>;

  leave(userId: string): Promise<void>;

  enterRoom(userEnterRoomRequest: UserConnectRequest): Promise<void>;

  leaveRoom(userLeaveRoomRequest: UserConnectRequest): Promise<void>;

  getOnLineUserList(): Promise<Record<string, string>>;
}

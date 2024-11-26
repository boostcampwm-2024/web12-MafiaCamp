import { UserEnterRequest } from './dto/user.enter.request';
import { UserLeaveRequest } from './dto/user.leave.request';
import { UserEnterRoomRequest } from './dto/user.enter-room.request';
import { UserLeaveRoomRequest } from './dto/user.leave-room.request';

export const CONNECTED_USER_USECASE = Symbol('CONNECTED_USER_USECASE');

export interface ConnectedUserUsecase {
  enter(userEnterRequest: UserEnterRequest): void;

  leave(userLeaveRequest:UserLeaveRequest): void;

  enterRoom(userEnterRoomRequest: UserEnterRoomRequest): void;

  leaveRoom(userLeaveRoomRequest: UserLeaveRoomRequest): void;
}
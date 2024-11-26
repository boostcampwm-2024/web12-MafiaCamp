import { ConnectedUserUsecase } from './connected-user.usecase';
import { UserEnterRequest } from './dto/user.enter.request';
import { UserEnterRoomRequest } from './dto/user.enter-room.request';
import { UserLeaveRequest } from './dto/user.leave.request';
import { UserLeaveRoomRequest } from './dto/user.leave-room.request';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConnectedUserService implements ConnectedUserUsecase {
  enter(userEnterRequest: UserEnterRequest): void {
  }

  enterRoom(userEnterRoomRequest: UserEnterRoomRequest): void {
  }

  leave(userLeaveRequest: UserLeaveRequest): void {
  }

  leaveRoom(userLeaveRoomRequest: UserLeaveRoomRequest): void {
  }

}
import { ConnectedUserUsecase } from './connected-user.usecase';
import { UserEnterRequest } from './dto/user.enter.request';
import { UserEnterRoomRequest } from './dto/user.enter-room.request';
import { UserLeaveRequest } from './dto/user.leave.request';
import { UserLeaveRoomRequest } from './dto/user.leave-room.request';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ConnectedUserService implements ConnectedUserUsecase {
  constructor(private readonly redisService: RedisService) {}

  enter(userEnterRequest: UserEnterRequest): void {
    return;
  }

  enterRoom(userEnterRoomRequest: UserEnterRoomRequest): void {
    return;
  }

  leave(userLeaveRequest: UserLeaveRequest): void {
    return;
  }

  leaveRoom(userLeaveRoomRequest: UserLeaveRoomRequest): void {
    return;
  }
}

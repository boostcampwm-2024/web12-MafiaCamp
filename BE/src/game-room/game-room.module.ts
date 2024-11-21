import { Module } from '@nestjs/common';
import { GameRoomService } from './game-room.service';

@Module({
  providers: [GameRoomService],
  exports: [GameRoomService],
})
export class GameRoomModule {}

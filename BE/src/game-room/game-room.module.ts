import { Module } from '@nestjs/common';
import { GameRoomService } from './game-room.service';
import { GameRoomController } from './controller/game-room.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [GameRoomController],
  imports: [AuthModule],
  providers: [GameRoomService],
  exports: [GameRoomService],
})
export class GameRoomModule {}

import { Module } from '@nestjs/common';
import { GameRoomService } from './game-room.service';
import { VideoServerModule } from 'src/video-server/video-server.module';

@Module({
  imports: [VideoServerModule],
  providers: [GameRoomService],
  exports: [GameRoomService],
})
export class GameRoomModule {}

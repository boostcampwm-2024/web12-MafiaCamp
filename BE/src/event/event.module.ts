import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { GameRoomModule } from 'src/game-room/game-room.module';
import { EventManager } from './event-manager';

@Module({
  imports: [GameRoomModule],
  providers: [EventGateway, EventManager],
})
export class EventModule {}

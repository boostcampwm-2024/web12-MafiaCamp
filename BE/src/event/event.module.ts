import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { GameRoomModule } from 'src/game-room/game-room.module';
import { EventManager } from './event-manager';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [GameRoomModule, GameModule,],
  providers: [EventGateway, EventManager],
})
export class EventModule {}

import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { GameRoomModule } from 'src/game-room/game-room.module';
import { EventManager } from './event-manager';
import { GameModule } from 'src/game/game.module';
import { OnlineStateModule } from '../online-state/online-state.module';

@Module({
  imports: [GameRoomModule, GameModule, OnlineStateModule],
  providers: [EventGateway, EventManager],
})
export class EventModule {}

import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { GameRoomModule } from 'src/game-room/game-room.module';
import { EventManager } from './event-manager';
import { GameModule } from 'src/game/game.module';
import { APP_FILTER } from '@nestjs/core';
import { WebsocketExceptionFilter } from '../common/filter/websocket.exception.filter';

@Module({
  imports: [GameRoomModule, GameModule],
  providers: [EventGateway, EventManager, {
    provide: APP_FILTER,
    useClass: WebsocketExceptionFilter,
  }],
})
export class EventModule {
}

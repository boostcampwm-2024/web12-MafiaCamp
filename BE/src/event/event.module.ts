import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { GameRoomModule } from 'src/game-room/game-room.module';
import { EventManager } from './event-manager';
import { GameModule } from 'src/game/game.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [GameRoomModule, GameModule, UserModule],
  providers: [EventGateway, EventManager],
})
export class EventModule {}

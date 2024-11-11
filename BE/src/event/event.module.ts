import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { RoomModule } from 'src/room/room.module';
import { VideoServerModule } from 'src/video-server/video-server.module';
import { EventManager } from './event-manager';

@Module({
  imports: [RoomModule, VideoServerModule],
  providers: [EventGateway, EventManager],
})
export class EventModule {}

import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { RoomsModule } from 'src/room/room.module';
import { VideoServerModule } from 'src/video-server/video-server.module';

@Module({
  imports: [RoomsModule, VideoServerModule],
  providers: [EventGateway],
})
export class EventModule {}

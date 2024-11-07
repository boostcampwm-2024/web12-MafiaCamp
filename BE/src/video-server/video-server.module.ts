import { Module } from '@nestjs/common';
import { OpenviduService } from './implementations/openvidu.service';
import { VideoServerController } from './video-server.controller';
import { VIDEO_SERVER_USECASE } from './usecase/video-server.usecase';

@Module({
  controllers: [VideoServerController],
  providers: [
    {
      provide: VIDEO_SERVER_USECASE,
      useClass: OpenviduService,
    },
  ],
  exports: [VIDEO_SERVER_USECASE],
})
export class VideoServerModule {}

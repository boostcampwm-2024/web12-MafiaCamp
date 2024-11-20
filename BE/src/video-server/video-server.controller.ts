import { Controller, Get, Inject, Param } from '@nestjs/common';
import {
  VIDEO_SERVER_USECASE,
  VideoServerUsecase,
} from './usecase/video-server.usecase';

@Controller('video-server')
export class VideoServerController {
  constructor(
    @Inject(VIDEO_SERVER_USECASE)
    private readonly videoServerUsecase: VideoServerUsecase,
  ) {}

  @Get('sessions/:roomId/participants')
  async getSessionParticipants(@Param('roomId') roomId: string) {
    return this.videoServerUsecase.getActiveParticipants(roomId);
  }
}

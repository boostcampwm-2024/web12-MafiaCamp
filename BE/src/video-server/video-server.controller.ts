import { Controller, Get, Inject, Param } from '@nestjs/common';
import { OpenviduService } from './implementations/openvidu.service';
import { VIDEO_SERVER_USECASE } from './usecase/video-server.usecase';

@Controller('video-server')
export class VideoServerController {
  constructor(
    @Inject(VIDEO_SERVER_USECASE)
    private readonly openviduService: OpenviduService,
  ) {}

  @Get('sessions/:roomId/participants')
  async getSessionParticipants(@Param('roomId') roomId: string) {
    return this.openviduService.getActiveParticipants(roomId);
  }
}

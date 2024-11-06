import { Controller, Get, Inject } from '@nestjs/common';
import { OpenviduService } from './implementations/openvidu.service';
import { VIDEO_SERVER_USECASE } from './usecase/video-server.usecase';

@Controller('video-server')
export class VideoServerController {
  constructor(
    @Inject(VIDEO_SERVER_USECASE)
    private readonly videoServerService: OpenviduService,
  ) {}

  @Get()
  async getTest() {
    return this.videoServerService.testConnection();
  }
}

import { Controller, Get } from '@nestjs/common';
import { OpenviduService } from './openvidu.service';

@Controller('openvidu')
export class OpenviduController {
  constructor(private readonly openviduService: OpenviduService) {}

  @Get()
  async testOpenvidu() {
    return await this.openviduService.testConnection();
  }
}

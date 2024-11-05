import { Controller } from '@nestjs/common';
import { OpenviduService } from './openvidu.service';

@Controller('openvidu')
export class OpenviduController {
  constructor(private readonly openviduService: OpenviduService) {}
}

import { Module } from '@nestjs/common';
import { OpenviduService } from './openvidu.service';
import { OpenviduController } from './openvidu.controller';

@Module({
  controllers: [OpenviduController],
  providers: [OpenviduService],
})
export class OpenviduModule {}

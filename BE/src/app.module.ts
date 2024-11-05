import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenviduModule } from './openvidu/openvidu.module';

@Module({
  imports: [OpenviduModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

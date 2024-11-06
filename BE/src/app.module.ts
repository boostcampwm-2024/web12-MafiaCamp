import { Module } from '@nestjs/common';
import { OpenviduModule } from './openvidu/openvidu.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OpenviduModule,
  ],
})
export class AppModule {}

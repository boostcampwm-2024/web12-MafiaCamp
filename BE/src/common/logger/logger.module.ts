import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { winstonConfig } from './winston.config';

@Module({
  imports:[
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: winstonConfig
    })
  ],
  exports: [WinstonModule]
})
export class LoggerModule {}
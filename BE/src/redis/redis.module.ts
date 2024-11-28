import { Module } from '@nestjs/common';
import { IO_USER_USECASE } from './io-user.usecase';
import { RedisService } from './redis.service';

@Module({
  providers: [
    {
      provide: IO_USER_USECASE,
      useClass: RedisService,
    },
  ],
  exports: [IO_USER_USECASE],
})
export class RedisModule {}

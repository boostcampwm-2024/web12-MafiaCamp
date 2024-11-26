import { Module } from '@nestjs/common';
import { REDIS_IO_USER_USECASE } from './redis-io-user.usecase';
import { RedisService } from './redis.service';

@Module({
  providers: [
    {
      provide: REDIS_IO_USER_USECASE,
      useClass: RedisService,
    },
  ],
  exports: [REDIS_IO_USER_USECASE],
})
export class RedisModule {}

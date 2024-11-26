import { Module } from '@nestjs/common';
import { CONNECTED_USER_USECASE } from './connected-user.usecase';
import { ConnectedUserService } from './connected-user.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: CONNECTED_USER_USECASE,
      useClass: ConnectedUserService,
    },
  ],
  exports: [CONNECTED_USER_USECASE],
})
export class OnlineStateModule {}

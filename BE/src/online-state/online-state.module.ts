import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameUserEntity } from './entity/game-user.entity';
import { GAME_USER_REPOSITORY } from './repository/game-user.repository';
import { TypeormGameUserRepository } from './repository/typeorm.game-user.repository';
import { REGISTER_GAME_USER_USECASE } from './usecase/register.game-user.usecase';
import { GameUserService } from './game-user.service';
import { FIND_GAME_USER_USECASE } from './usecase/find.game-user.usecase';
import { UserModule } from '../user/user.module';
import { CONNECTED_USER_USECASE } from './connected-user.usecase';
import { ConnectedUserService } from './connected-user.service';

@Module({
  imports: [],
  providers: [
    {
      provide: CONNECTED_USER_USECASE,
      useClass: ConnectedUserService
    }
  ],
  exports: [CONNECTED_USER_USECASE],
})
export class OnlineStateModule {}

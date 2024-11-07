import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameUserEntity } from './enitity/game-user.entity';
import { GAME_USER_REPOSITORY } from './repository/game-user.repository';
import { TypeormGameUserRepository } from './repository/typeorm.game-user.repository';
import { REGISTER_GAME_USER_USECASE } from './usecase/register.game-user.usecase';
import { GameUserService } from './game-user.service';
import { FIND_GAME_USER_USECASE } from './usecase/find.game-user.usecase';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([GameUserEntity]),UserModule],
  providers: [
    {
      provide: GAME_USER_REPOSITORY,
      useClass: TypeormGameUserRepository,
    },
    {
      provide: REGISTER_GAME_USER_USECASE,
      useClass: GameUserService,
    },
    {
      provide: FIND_GAME_USER_USECASE,
      useClass: GameUserService,
    },
  ],
  exports: [REGISTER_GAME_USER_USECASE, FIND_GAME_USER_USECASE],
})
export class GameUserModule {}
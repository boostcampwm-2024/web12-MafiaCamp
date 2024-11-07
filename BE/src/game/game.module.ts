import { Module } from '@nestjs/common';
import { RandomJobFactory } from './random.job.factory';
import { JOB_FACTORY } from './job.factory';
import { ALLOCATE_USER_ROLE_USECASE } from './usecase/allocate.user-role.usecase';
import { GameService } from './game.service';
import { TypeormGameHistoryRepository } from './repository/typeorm.game-history.repository';
import { GAME_HISTORY_REPOSITORY } from './repository/game-history.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameHistoryEntity } from './entity/game-history.entity';
import { COUNTDOWN_TIMER } from './countdown.timer';
import { MafiaCountdownTimer } from './mafia.countdown.timer';
import { COUNTDOWN_TIMEOUT_USECASE } from './usecase/countdown.timeout.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([GameHistoryEntity])]
  , providers: [
    {
      provide: JOB_FACTORY,
      useClass: RandomJobFactory,
    },
    {
      provide: ALLOCATE_USER_ROLE_USECASE,
      useClass: GameService,
    },
    {
      provide: GAME_HISTORY_REPOSITORY,
      useClass: TypeormGameHistoryRepository,
    },
    {
      provide: COUNTDOWN_TIMER,
      useClass: MafiaCountdownTimer,
    },
    {
      provide: COUNTDOWN_TIMEOUT_USECASE,
      useClass: GameService,
    },
  ],
  exports: [
    ALLOCATE_USER_ROLE_USECASE, COUNTDOWN_TIMEOUT_USECASE,
  ],
})
export class GameModule {
}
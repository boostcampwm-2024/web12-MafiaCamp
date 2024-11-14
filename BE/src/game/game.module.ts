import { Module } from '@nestjs/common';
import { RandomJobFactory } from './usecase/allocate-user-role/random.job.factory';
import { JOB_FACTORY } from './usecase/allocate-user-role/job.factory';
import { ALLOCATE_USER_ROLE_USECASE } from './usecase/allocate-user-role/allocate.user-role.usecase';
import { TypeormGameHistoryRepository } from './repository/typeorm.game-history.repository';
import { GAME_HISTORY_REPOSITORY } from './repository/game-history.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameHistoryEntity } from './entity/game-history.entity';
import { COUNTDOWN_TIMER } from './usecase/countdown/countdown.timer';
import { MafiaCountdownTimer } from './usecase/countdown/mafia.countdown.timer';
import { COUNTDOWN_TIMEOUT_USECASE } from './usecase/countdown/countdown.timeout.usecase';
import { GAME_MANAGER } from './usecase/game-manager/game-manager';
import { TotalGameManager } from './usecase/game-manager/total.game-manager';
import { AllocateUserRoleService } from './usecase/allocate-user-role/allocate.user-role.service';
import { CountdownTimeoutService } from './usecase/countdown/countdown.timeout.service';
import { VOTE_MAFIA_USECASE } from './usecase/game-manager/vote.mafia.usecase';
import { VoteMafiaService } from './usecase/game-manager/vote.mafia.service';
import { ArgumentState } from './fsm/states/argument.state';
import { DiscussionState } from './fsm/states/discussion.state';
import { MafiaState } from './fsm/states/mafia.state';
import { VoteState } from './fsm/states/vote.state';
import { START_GAME_USECASE } from './usecase/start-game/start-game.usecase';
import { DoctorState } from './fsm/states/doctor.state';
import { PoliceState } from './fsm/states/police.state';
import { VideoServerModule } from 'src/video-server/video-server.module';
import { SetUpState } from './fsm/states/set-up.state';
import { StartGameService } from './usecase/start-game/start-game.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameHistoryEntity]), VideoServerModule],
  providers: [
    {
      provide: JOB_FACTORY,
      useClass: RandomJobFactory,
    },
    {
      provide: ALLOCATE_USER_ROLE_USECASE,
      useClass: AllocateUserRoleService,
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
      useClass: CountdownTimeoutService,
    },
    {
      provide: GAME_MANAGER,
      useClass: TotalGameManager,
    },
    {
      provide: VOTE_MAFIA_USECASE,
      useClass: VoteMafiaService,
    },
    {
      provide: START_GAME_USECASE,
      useClass: StartGameService,
    },
    ArgumentState, DiscussionState, DoctorState, MafiaState, PoliceState, SetUpState, VoteState
  ],
  exports: [
    START_GAME_USECASE, ALLOCATE_USER_ROLE_USECASE, COUNTDOWN_TIMEOUT_USECASE, VOTE_MAFIA_USECASE,
  ],
})
export class GameModule {
}

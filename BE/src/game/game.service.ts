import { AllocateUserRoleUsecase } from './usecase/allocate.user-role.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { AllocateJobRequest } from './dto/allocate.job.request';
import { AllocateJobResponse } from './dto/allocate.job.response';
import { JOB_FACTORY, JobFactory } from './job.factory';
import {
  GAME_HISTORY_REPOSITORY,
  GameHistoryRepository,
} from './repository/game-history.repository';
import { GameHistoryEntity } from './entity/game-history.entity';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class GameService implements AllocateUserRoleUsecase {
  constructor(
    @Inject(JOB_FACTORY)
    private readonly jobFactory: JobFactory,
    @Inject(GAME_HISTORY_REPOSITORY)
    private readonly gameHistoryRepository: GameHistoryRepository<
      GameHistoryEntity,
      number
    >,
  ) {}

  /*
    GameHistory에는 저장이 되지만 아직 GameUser 테이블에는 저장되지 않습니다.
    저장되기 위해서는 UserId가 필요한데 아직 회원가입과 로그인이 진행되지 않아서 저장부분 제외했습니다.
    하지만 모든 로직은 완성되어 있어서 바로 사용이 가능합니다.
   */
  @Transactional()
  async allocate(jobRequest: AllocateJobRequest): Promise<AllocateJobResponse> {
    const playerIds = jobRequest.playerIds;
    const gameHistoryEntity = new GameHistoryEntity();
    await this.gameHistoryRepository.save(gameHistoryEntity);
    const userRoles = this.jobFactory.allocateGameRoles(playerIds);
    return new AllocateJobResponse(userRoles);
  }
}

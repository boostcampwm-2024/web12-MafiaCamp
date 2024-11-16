import { VoteMafiaUsecase } from './vote.mafia.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { GameRoom } from '../../../game-room/entity/game-room.model';
import { VOTE_MANAGER, VoteManager } from './vote-manager';
import { VOTE_STATE } from '../../vote-state';

@Injectable()
export class VoteMafiaService implements VoteMafiaUsecase {

  constructor(
    @Inject(VOTE_MANAGER)
    private readonly gameManager: VoteManager,
  ) {
  }

  async cancelVote(gameRoom: GameRoom, from: string, to: string): Promise<void> {
    await this.gameManager.cancelVote(gameRoom, from, to);
  }

  async finalVoteResult(gameRoom: GameRoom): Promise<VOTE_STATE> {
    return await this.gameManager.finalVoteResult(gameRoom);
  }

  async primaryVoteResult(gameRoom: GameRoom): Promise<VOTE_STATE> {
    return await this.gameManager.primaryVoteResult(gameRoom);
  }

  async registerBallotBox(gameRoom: GameRoom): Promise<void> {
    await this.gameManager.registerBallotBox(gameRoom);
  }

  async vote(gameRoom: GameRoom, from: string, to: string): Promise<void> {
    await this.gameManager.vote(gameRoom, from, to);
  }

}
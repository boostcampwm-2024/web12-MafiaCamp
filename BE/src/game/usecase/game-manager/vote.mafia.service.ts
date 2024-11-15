import { VoteMafiaUsecase } from './vote.mafia.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { GameRoom } from '../../../game-room/entity/game-room.model';
import { GAME_MANAGER, GameManager } from './game-manager';

@Injectable()
export class VoteMafiaService implements VoteMafiaUsecase {

  constructor(
    @Inject(GAME_MANAGER)
    private readonly gameManager: GameManager,
  ) {
  }

  async cancelVote(gameRoom: GameRoom, from: string, to: string): Promise<void> {
    await this.gameManager.cancelVote(gameRoom, from, to);
  }

  async finalVoteResult(gameRoom: GameRoom): Promise<void> {
    await this.gameManager.finalVoteResult(gameRoom);
  }

  async primaryVoteResult(gameRoom: GameRoom): Promise<void> {
    await this.gameManager.primaryVoteResult(gameRoom);
  }

  async registerBallotBox(gameRoom: GameRoom): Promise<void> {
    await this.gameManager.registerBallotBox(gameRoom);
  }

  async vote(gameRoom: GameRoom, from: string, to: string): Promise<void> {
    await this.gameManager.vote(gameRoom, from, to);
  }

}
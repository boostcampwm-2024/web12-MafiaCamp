import { VoteMafiaUsecase } from './vote.mafia.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { GameRoom } from '../../../game-room/entity/game-room.model';
import { GameClient } from '../../../game-room/entity/game-client.model';
import { GAME_MANAGER, GameManager } from './game-manager';

@Injectable()
export class VoteMafiaService implements VoteMafiaUsecase {

  constructor(
    @Inject(GAME_MANAGER)
    private readonly gameManager: GameManager,
  ) {
  }

  cancelVote(gameRoom: GameRoom, from: GameClient, to: GameClient): void {
    this.gameManager.cancelVote(gameRoom, from, to);
  }

  finalVoteResult(gameRoom: GameRoom): void {
    this.gameManager.finalVoteResult(gameRoom);
  }

  primaryVoteResult(gameRoom: GameRoom): void {
    this.gameManager.primaryVoteResult(gameRoom);
  }

  registerBallotBox(gameRoom: GameRoom): void {
    this.gameManager.registerBallotBox(gameRoom);
  }

  vote(gameRoom: GameRoom, from: GameClient, to: GameClient): void {
    this.gameManager.vote(gameRoom, from, to);
  }

}
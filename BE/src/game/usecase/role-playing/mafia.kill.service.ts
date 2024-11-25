import { MafiaKillUsecase } from './mafia.kill.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { MAFIA_MANAGER, MafiaManager } from './mafia-manager';
import { GameRoom } from '../../../game-room/entity/game-room.model';

@Injectable()
export class MafiaKillService implements MafiaKillUsecase {
  constructor(
    @Inject(MAFIA_MANAGER)
    private readonly mafiaManager: MafiaManager,
  ) {
  }

  async selectMafiaTarget(
    gameRoom: GameRoom,
    from: string,
    killTarget: string,
  ): Promise<void> {
    await this.mafiaManager.selectMafiaTarget(gameRoom, from, killTarget);
  }

  async initMafia(gameRoom: GameRoom): Promise<void> {
    await this.mafiaManager.initMafia(gameRoom);
  }

  async decisionMafiaTarget(gameRoom: GameRoom): Promise<void> {
    await this.mafiaManager.decisionMafiaTarget(gameRoom);
  }
}

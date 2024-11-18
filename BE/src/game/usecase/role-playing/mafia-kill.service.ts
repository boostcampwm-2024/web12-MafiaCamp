import { MafiaKillUsecase } from './mafia.kill.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { MAFIA_MANAGER, MafiaManager } from './mafia-manager';
import { GameRoom } from '../../../game-room/entity/game-room.model';

@Injectable()
export class MafiaKillService implements MafiaKillUsecase {
  constructor(
    @Inject(MAFIA_MANAGER)
    private readonly mafiaManager: MafiaManager,
  ) {}
  async mafiaSelectTarget(gameRoom: GameRoom, target: string): Promise<void> {
    await this.mafiaManager.mafiaSelectTarget(gameRoom, target);
  }

  async sendCurrentTarget(target: string, gameRoom: GameRoom): Promise<void> {
    await this.mafiaManager.sendCurrentTarget(target, gameRoom);
  }

  async initMafia(gameRoom: GameRoom): Promise<void> {
    await this.mafiaManager.initMafia(gameRoom);
  }

  async finishMafia(gameRoom: GameRoom): Promise<void> {
    await this.mafiaManager.finishMafia(gameRoom);
  }
}

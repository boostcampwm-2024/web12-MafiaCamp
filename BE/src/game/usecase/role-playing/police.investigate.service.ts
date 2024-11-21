import { PoliceInvestigateUsecase } from './police.investigate.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { GameRoom } from '../../../game-room/entity/game-room.model';
import { POLICE_MANAGER, PoliceManager } from './police-manager';

@Injectable()
export class PoliceInvestigateService implements PoliceInvestigateUsecase {

  constructor(
    @Inject(POLICE_MANAGER)
    private readonly policeManager: PoliceManager,
  ) {
  }

  async executePolice(gameRoom: GameRoom, police: string, criminal: string): Promise<void> {
    await this.policeManager.executePolice(gameRoom, police, criminal);
  }
}
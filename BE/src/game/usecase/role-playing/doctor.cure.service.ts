import { DoctorCureUsecase } from './doctor.cure.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { DOCTOR_MANAGER, DoctorManager } from './doctor-manager';
import { GameRoom } from '../../../game-room/entity/game-room.model';

@Injectable()
export class DoctorCureService implements DoctorCureUsecase {
  constructor(
    @Inject(DOCTOR_MANAGER)
    private readonly doctorManager: DoctorManager,
  ) {}
  async isDoctorAlive(gameRoom: GameRoom): Promise<boolean> {
    return await this.doctorManager.isDoctorAlive(gameRoom);
  }

  async selectDoctorTarget(
    gameRoom: GameRoom,
    from: string,
    saveTarget: string,
  ): Promise<void> {
    await this.doctorManager.selectDoctorTarget(gameRoom, from, saveTarget);
  }
}

import { DoctorSaveUsecase } from './doctor.save.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { DOCTOR_MANAGER, DoctorManager } from './doctor-manager';
import { GameRoom } from '../../../game-room/entity/game-room.model';

@Injectable()
export class DoctorSaveService implements DoctorSaveUsecase {
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

  async decisionSurvivorByDoctor(
    gameRoom: GameRoom,
    saveTarget: string,
  ): Promise<void> {
    await this.doctorManager.decisionSurvivorByDoctor(gameRoom, saveTarget);
  }
}

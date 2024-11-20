import { GameRoom } from '../../../game-room/entity/game-room.model';

export const DOCTOR_SAVE_USECASE = Symbol('DOCTOR_SAVE_USECASE');

export interface DoctorSaveUsecase {
  isDoctorAlive(gameRoom: GameRoom): Promise<boolean>;

  selectDoctorTarget(
    gameRoom: GameRoom,
    from: string,
    saveTarget: string,
  ): Promise<void>;

  decisionSurvivorByDoctor(
    gameRoom: GameRoom,
    saveTarget: string,
  ): Promise<void>;
}

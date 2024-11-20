import { GameRoom } from '../../../game-room/entity/game-room.model';

export const DOCTOR_CURE_USECASE = Symbol('DOCTOR_CURE_USECASE');

export interface DoctorCureUsecase {
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

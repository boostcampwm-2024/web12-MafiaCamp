import { DetectEarlyQuitRequest } from '../../dto/detect.early.quit.request';

export const DETECT_EARLY_QUIT_USECASE = Symbol('DETECT_EARLY_QUIT_USECASE');

export interface DetectEarlyQuitUsecase {
  detect(detectEarlyQuitRequest: DetectEarlyQuitRequest): Promise<boolean>;
}
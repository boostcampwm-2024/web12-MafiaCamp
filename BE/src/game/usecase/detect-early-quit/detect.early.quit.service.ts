import { DetectEarlyQuitUsecase } from './detect.early.quit.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { DetectEarlyQuitRequest } from '../../dto/detect.early.quit.request';
import { DETECT_MANAGER, DetectManager } from './detect.manager';

@Injectable()
export class DetectEarlyQuitService implements DetectEarlyQuitUsecase {

  constructor(@Inject(DETECT_MANAGER)
              private readonly detectManager: DetectManager) {
  }

  async detect(detectEarlyQuitRequest: DetectEarlyQuitRequest): Promise<boolean> {
    await this.detectManager.detect(detectEarlyQuitRequest.gameRoom, detectEarlyQuitRequest.eventClient);
  }

}
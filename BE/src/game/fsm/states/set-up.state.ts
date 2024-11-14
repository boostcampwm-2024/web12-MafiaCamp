import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StartCountdownRequest } from 'src/game/dto/start.countdown.request';
import { CountdownTimeoutService } from 'src/game/usecase/countdown/countdown.timeout.service';
import { COUNTDOWN_TIMEOUT_USECASE } from 'src/game/usecase/countdown/countdown.timeout.usecase';
import { GameState, TransitionHandler } from './state';
import { GameContext } from '../game-context';
import { DiscussionState } from './discussion.state';
import {
  VIDEO_SERVER_USECASE,
  VideoServerUsecase,
} from 'src/video-server/usecase/video-server.usecase';
import { GameRoom } from 'src/game-room/entity/game-room.model';
import {
  ALLOCATE_USER_ROLE_USECASE,
  AllocateUserRoleUsecase,
} from 'src/game/usecase/allocate-user-role/allocate.user-role.usecase';
import { AllocateJobRequest } from 'src/game/dto/allocate.job.request';
import { OpenViduRoleType } from 'src/video-server/types/openvidu.type';

@Injectable()
export class SetUpState extends GameState {
  constructor(
    @Inject(VIDEO_SERVER_USECASE)
    private readonly videoServerUseCase: VideoServerUsecase,
    @Inject(ALLOCATE_USER_ROLE_USECASE)
    private readonly allocateUserRoleUsecase: AllocateUserRoleUsecase,
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutService: CountdownTimeoutService,
    @Inject(forwardRef(() => DiscussionState))
    private readonly discussionState: DiscussionState,
  ) {
    super();
  }

  async handle(context: GameContext, next: TransitionHandler) {
    const room = context.room;
    // await this.startVideo(room);
    await this.allocateUserRole(room);

    // 게임이 시작하기 전에 5초의 여유 기간을 두기 위함입니다. 프론트엔드에서는 '잠시 후 게임이 시작됩니다.'와 같은 메시지를 표시하면 좋을 것 같습니다.
    await this.countdownTimeoutService.countdownStart(
      new StartCountdownRequest(room, 'INTERMISSION'),
    );

    next(this.discussionState);
  }

  async startVideo(room: GameRoom) {
    const roomId = room.roomId;
    const clients = room.clients;

    const sessionId = await this.videoServerUseCase.createSession(roomId);

    clients.forEach(async (c) => {
      const token = await this.videoServerUseCase.generateToken(
        roomId,
        c.nickname,
        OpenViduRoleType.PUBLISHER,
      );
      c.send('video-info', {
        token,
        sessionId,
      });
    });
  }

  async allocateUserRole(room: GameRoom) {
    await this.allocateUserRoleUsecase.allocate(new AllocateJobRequest(room));
  }
}

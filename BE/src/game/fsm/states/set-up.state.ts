import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StartCountdownRequest } from 'src/game/dto/start.countdown.request';
import {
  COUNTDOWN_TIMEOUT_USECASE,
  CountdownTimeoutUsecase,
} from 'src/game/usecase/countdown/countdown.timeout.usecase';
import { GameState, TransitionHandler } from './state';
import { GameContext } from '../game-context';
import { DiscussionState } from './discussion.state';
import { VIDEO_SERVER_USECASE, VideoServerUsecase } from 'src/video-server/usecase/video-server.usecase';
import { GameRoom } from 'src/game-room/entity/game-room.model';
import {
  ALLOCATE_USER_ROLE_USECASE,
  AllocateUserRoleUsecase,
} from 'src/game/usecase/allocate-user-role/allocate.user-role.usecase';
import { AllocateJobRequest } from 'src/game/dto/allocate.job.request';
import { OpenViduRoleType } from 'src/video-server/types/openvidu.type';
import { GameRoomStatus } from 'src/game-room/entity/game-room.status';

@Injectable()
export class SetUpState extends GameState {
  constructor(
    @Inject(VIDEO_SERVER_USECASE)
    private readonly videoServerUseCase: VideoServerUsecase,
    @Inject(ALLOCATE_USER_ROLE_USECASE)
    private readonly allocateUserRoleUsecase: AllocateUserRoleUsecase,
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutUsecase: CountdownTimeoutUsecase,
    @Inject(forwardRef(() => DiscussionState))
    private readonly discussionState: DiscussionState,
  ) {
    super();
  }

  async handle(context: GameContext, next: TransitionHandler) {
    const room = context.room;
    room.status = GameRoomStatus.RUNNING;
    console.log('aaa');
    await this.startVideo(room);
    console.log('bbb');
    await this.allocateUserRole(room);
    console.log('ccc');
    await this.countdownTimeoutUsecase.countdownStart(
      new StartCountdownRequest(room, 'INTERMISSION'),
    );

    next(this.discussionState);
  }

  private async startVideo(room: GameRoom) {
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

  private async allocateUserRole(room: GameRoom) {
    await this.allocateUserRoleUsecase.allocate(new AllocateJobRequest(room));
  }
}

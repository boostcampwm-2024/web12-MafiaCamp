import { MafiaCountdownTimer } from '../../../../src/game/usecase/countdown/mafia.countdown.timer';
import { GameRoom } from '../../../../src/game-room/entity/game-room.model';
import { GameClient } from '../../../../src/game-room/entity/game-client.model';
import { EventClient } from '../../../../src/event/event-client.model';
import { TIMEOUT_SITUATION } from '../../../../src/game/timeout.situation';
import { DuplicateTimerException } from '../../../../src/common/error/duplicate.timer.exception';
import { NotFoundTimerException } from '../../../../src/common/error/not.found.timer.exception';

describe('MafiaCountdownTest 테스트', () => {
  let timer: MafiaCountdownTimer;
  let gameRoom: GameRoom;
  let mockClients: GameClient[];

  const createMockEventClient = (nickname: string): EventClient => {
    return {
      emit: jest.fn(),
      nickname,
    } as unknown as EventClient;
  };

  const createMockGameClient = (nickname: string): GameClient => {
    const eventClient = createMockEventClient(nickname);
    return new GameClient(eventClient);
  };

  const setupGameRoom = (playerCount: number): void => {
    gameRoom = new GameRoom('TEST-ROOM-ABCDE-FGHY', playerCount);
    mockClients = Array.from({ length: playerCount }, (_, idx) => {
      return createMockGameClient(`player${idx + 1}`);
    });

    mockClients.forEach((client) => {
      gameRoom.enter(client);
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
    timer = new MafiaCountdownTimer();
    setupGameRoom(6);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it.each(['DISCUSSION', 'ARGUMENT', 'VOTE', 'MAFIA', 'DOCTOR', 'POLICE', 'INTERMISSION'])
  ('%s 시작 타이머가 시작되면 모든 클라이어트에게 countdown 이벤트를 보낸다', async (situation: string) => {
    //given
    const maxTime = TIMEOUT_SITUATION[situation];

    //when
    const timerPromise = timer.start(gameRoom, situation);

    //then
    jest.advanceTimersByTime(1000);

    mockClients.forEach(mockClient => {
      expect(mockClient.client.emit).toHaveBeenCalledWith(
        'countdown',
        expect.objectContaining({
          situation,
          timeLeft: maxTime,
        }),
      );
    });

    timer.stop(gameRoom);
    await timerPromise;
  });

  it.each(['DISCUSSION', 'ARGUMENT', 'VOTE', 'MAFIA', 'DOCTOR', 'POLICE', 'INTERMISSION'])
  ('%s 타이머가 종료되면 모든 클라이어트에게 countdown-exit 이벤트를 보낸다', async (situation: string) => {
    //given
    const maxTime = TIMEOUT_SITUATION[situation];

    //when
    const timerPromise = timer.start(gameRoom, situation);
    jest.advanceTimersByTime((maxTime + 1) * 1000);

    //then
    mockClients.forEach(mockClient => {
      expect(mockClient.client.emit).toHaveBeenCalledWith(
        'countdown-exit',
        expect.objectContaining({
          situation,
          timeLeft: 0,
        }),
      );
    });

    await timerPromise;
  });

  it.each(['DISCUSSION', 'ARGUMENT', 'VOTE', 'MAFIA', 'DOCTOR', 'POLICE', 'INTERMISSION'])
  ('%s 이미 실행 중인 타이머가 존재하면 DuplicateTimerException을 던진다', async (situation: string) => {
    //given
    const timerPromise = timer.start(gameRoom, situation);

    //when & then
    await expect(timer.start(gameRoom, situation))
      .rejects.toThrow(DuplicateTimerException);

    timer.stop(gameRoom);
    await timerPromise;
  });

  it('%s 존재하지 않는 타이머를 중지하면 NotFoundTimerException을 던진다', () => {
    //when & then
    expect(() => timer.stop(gameRoom))
      .toThrow(NotFoundTimerException);
  });
  it.each(['DISCUSSION', 'ARGUMENT', 'VOTE', 'MAFIA', 'DOCTOR', 'POLICE', 'INTERMISSION'])
  ('%s 타이머가 매 초마다 정확하게 카운트다운 이벤트를 보낸다', async (situation: string) => {
    //given
    const maxTime = TIMEOUT_SITUATION[situation];
    const timerPromise = timer.start(gameRoom, situation);

    //when & then
    for (let time = maxTime; time > 0; time--) {
      mockClients.forEach(mockClient => {
        jest.clearAllMocks();
      });

      jest.advanceTimersByTime(1000);

      mockClients.forEach(mockClient => {
        expect(mockClient.client.emit).toHaveBeenCalledWith(
          'countdown',
          expect.objectContaining({
            situation,
            timeLeft: time,
          }),
        );
        expect(mockClient.client.emit).toHaveBeenCalledTimes(1);
      });
    }

    timer.stop(gameRoom);
    await timerPromise;
  });

  it.each(['DISCUSSION', 'ARGUMENT', 'VOTE', 'MAFIA', 'DOCTOR', 'POLICE', 'INTERMISSION'])
  ('%s 타이머가 중지 시 즉시 이벤트 발송이 중단된다', async (situation: string) => {
    //given
    const timerPromise = timer.start(gameRoom, situation);

    jest.advanceTimersByTime(2000);

    //when
    timer.stop(gameRoom);

    jest.advanceTimersByTime(1000);

    //then
    mockClients.forEach(mockClient => {
      const emitCalls = (mockClient.client.emit as jest.Mock).mock.calls;
      const lastCall = emitCalls[emitCalls.length - 1];
      expect(lastCall[0]).not.toBe('countdown');
    });

    await timerPromise;
  });

});
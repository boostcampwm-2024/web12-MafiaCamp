import { CountdownTimeoutService } from '../../../../src/game/usecase/countdown/countdown.timeout.service';
import { COUNTDOWN_TIMER, CountdownTimer } from '../../../../src/game/usecase/countdown/countdown.timer';
import { GameRoom } from '../../../../src/game-room/entity/game-room.model';
import { Test, TestingModule } from '@nestjs/testing';
import { StartCountdownRequest } from '../../../../src/game/dto/start.countdown.request';
import { StopCountdownRequest } from '../../../../src/game/dto/stop.countdown.request';

describe('CountdownTimeoutService', () => {
  let service: CountdownTimeoutService;
  let mockCountdownTimer: jest.Mocked<CountdownTimer>;
  let gameRoom: GameRoom;

  beforeEach(async () => {
    mockCountdownTimer = {
      start: jest.fn(),
      stop: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountdownTimeoutService,
        {
          provide: COUNTDOWN_TIMER,
          useValue: mockCountdownTimer,
        },
      ],
    }).compile();

    service = module.get(CountdownTimeoutService);
    gameRoom = new GameRoom('TEST-ROOM', 6);
  });

  it.each(['DISCUSSION', 'ARGUMENT', 'VOTE', 'MAFIA', 'DOCTOR', 'POLICE', 'INTERMISSION'])
  ('%s CountdownTimer의 start 메서드를 호출해야 한다', async (situation: string) => {
    //given
    const startCountdownRequest = new StartCountdownRequest(gameRoom, situation);

    //when
    await service.countdownStart(startCountdownRequest);

    //then
    expect(mockCountdownTimer.start).toHaveBeenCalledTimes(1);
    expect(mockCountdownTimer.start).toHaveBeenCalledWith(gameRoom, situation);
  });

  it.each(['DISCUSSION', 'ARGUMENT', 'VOTE', 'MAFIA', 'DOCTOR', 'POLICE', 'INTERMISSION'])
  ('%s CountdownTimer의 stop 메소드를 호출해야 한다', async (situation: string) => {
    //given
    const stopRequest = new StopCountdownRequest(gameRoom);

    //when
    service.countdownStop(stopRequest);

    //then
    expect(mockCountdownTimer.stop).toHaveBeenCalledTimes(1);
    expect(mockCountdownTimer.stop).toHaveBeenCalledWith(gameRoom);
  });
});
import { JobFactory } from '../../../../src/game/usecase/allocate-user-role/job.factory';
import { RandomJobFactory } from '../../../../src/game/usecase/allocate-user-role/random.job.factory';
import { GameRoom } from '../../../../src/game-room/entity/game-room.model';
import { GameClient } from '../../../../src/game-room/entity/game-client.model';
import { EventClient } from '../../../../src/event/event-client.model';
import { MAFIA_ROLE } from '../../../../src/game/mafia-role';
import { GameInvalidPlayerCountException } from '../../../../src/common/error/game.invalid.player.count.exception';


describe('RandomJobFactory 테스트', () => {

  let randomJobFactory: JobFactory;
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
    gameRoom = new GameRoom('TEST-ABCD-EFGH-1234', playerCount);
    mockClients = Array.from({ length: playerCount }, (_, idx) => createMockGameClient(`Player${idx + 1}`));

    mockClients.forEach((gameClient) => {
      gameRoom.enter(gameClient);
    });
  };

  const countRoles = (roleMap: Map<GameClient, MAFIA_ROLE>): Record<MAFIA_ROLE, number> => {
    const counts: Record<MAFIA_ROLE, number> = { CITIZEN: 0, DOCTOR: 0, MAFIA: 0, POLICE: 0 };
    roleMap.forEach((role) => {
      counts[role] = (counts[role] || 0) + 1;
    });
    return counts;
  };


  beforeEach(() => {
    randomJobFactory = new RandomJobFactory();
    jest.clearAllMocks();
  });

  it('유저의 수가 6명일 때는 마피아 2명, 경찰 1명, 의사 0명, 시민 3명으로 구성된다', () => {
    //given
    setupGameRoom(6);

    //when
    const result = randomJobFactory.allocateGameRoles(gameRoom);

    //then
    const roleCounts = countRoles(result);
    expect(roleCounts[MAFIA_ROLE.MAFIA]).toBe(2);
    expect(roleCounts[MAFIA_ROLE.DOCTOR]).toBe(0);
    expect(roleCounts[MAFIA_ROLE.POLICE]).toBe(1);
    expect(roleCounts[MAFIA_ROLE.CITIZEN]).toBe(3);
  });

  it('유저의 수가 7명일 때는 마피아 2명, 경찰 1명, 의사 1명, 시민 3명으로 구성된다', () => {
    //given
    setupGameRoom(7);

    //when
    const result = randomJobFactory.allocateGameRoles(gameRoom);

    //then
    const roleCounts = countRoles(result);
    expect(roleCounts[MAFIA_ROLE.MAFIA]).toBe(2);
    expect(roleCounts[MAFIA_ROLE.DOCTOR]).toBe(1);
    expect(roleCounts[MAFIA_ROLE.POLICE]).toBe(1);
    expect(roleCounts[MAFIA_ROLE.CITIZEN]).toBe(3);
  });

  it('유저의 수가 8명일 때는 마피아 3명, 경찰 1명, 의사 1명, 시민 3명으로 구성된다', () => {
    //given
    setupGameRoom(8);

    //when
    const result = randomJobFactory.allocateGameRoles(gameRoom);

    //then
    const roleCounts = countRoles(result);
    expect(roleCounts[MAFIA_ROLE.MAFIA]).toBe(3);
    expect(roleCounts[MAFIA_ROLE.DOCTOR]).toBe(1);
    expect(roleCounts[MAFIA_ROLE.POLICE]).toBe(1);
    expect(roleCounts[MAFIA_ROLE.CITIZEN]).toBe(3);
  });


  it.each([
    1, 2, 3, 4, 5, 9, 10,
  ])('유저의 수가 %i명일 때는 GameInvalidPlayerCountException 예외를 던진다', (count: number) => {
    setupGameRoom(count);

    expect(() => randomJobFactory.allocateGameRoles(gameRoom))
      .toThrow(GameInvalidPlayerCountException);
  });

  it('마피아 역할이 할당되면 다른 마피아 정보와 함께 player-role 이벤트를 보낸다', () => {
    //given 마피아 2명인 경우로 테스트
    setupGameRoom(6);

    //when
    randomJobFactory.allocateGameRoles(gameRoom);

    //then
    const mafiaClients = mockClients.filter(client => client.job === MAFIA_ROLE.MAFIA);

    expect(mafiaClients).toHaveLength(2);

    mafiaClients.forEach(mafiaClient => {
      expect(mafiaClient.client.emit).toHaveBeenCalledWith(
        'player-role',
        expect.objectContaining({
          role: MAFIA_ROLE.MAFIA,
          another: expect.arrayContaining([
            expect.arrayContaining([
              expect.any(String),
              MAFIA_ROLE.MAFIA,
            ]),
          ]),
        }),
      );
    });
  });

  it('시민 역할이 할당되면 마피아 정보 없이 player-role 이벤트를 보낸다', () => {
    //given 시민 3명인 경우로 테스트
    setupGameRoom(6);

    //when
    randomJobFactory.allocateGameRoles(gameRoom);

    //then
    const citizenClients = mockClients.filter(client => client.job === MAFIA_ROLE.CITIZEN);

    expect(citizenClients).toHaveLength(3);

    citizenClients.forEach(citizenClient => {
      expect(citizenClient.client.emit).toHaveBeenCalledWith(
        'player-role',
        expect.objectContaining({
          role: MAFIA_ROLE.CITIZEN,
          another: null,
        }),
      );
    });
  });

  it('의사 역할이 할당되면 마피아 정보 없이 player-role 이벤트를 보낸다', () => {
    //given 의사 1인 경우로 테스트
    setupGameRoom(8);

    //when
    randomJobFactory.allocateGameRoles(gameRoom);

    //then
    const doctorClient = mockClients.filter(client => client.job === MAFIA_ROLE.DOCTOR);

    expect(doctorClient).toHaveLength(1);

    doctorClient.forEach(doctor => {
      expect(doctor.client.emit).toHaveBeenCalledWith(
        'player-role',
        expect.objectContaining({
          role: MAFIA_ROLE.DOCTOR,
          another: null,
        }),
      );
    });
  });

  it('경찰 역할이 할당되면 마피아 정보 없이 player-role 이벤트를 보낸다', () => {
    //given 경찰 1인 경우로 테스트
    setupGameRoom(8);

    //when
    randomJobFactory.allocateGameRoles(gameRoom);

    //then
    const policeClient = mockClients.filter(client => client.job === MAFIA_ROLE.POLICE);

    expect(policeClient).toHaveLength(1);

    policeClient.forEach(police => {
      expect(police.client.emit).toHaveBeenCalledWith(
        'player-role',
        expect.objectContaining({
          role: MAFIA_ROLE.POLICE,
          another: null,
        }),
      );
    });
  });
});
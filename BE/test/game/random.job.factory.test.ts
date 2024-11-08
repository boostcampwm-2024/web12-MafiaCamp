import { JobFactory } from '../../src/game/job.factory';
import { RandomJobFactory } from '../../src/game/random.job.factory';
import { MAFIA_ROLE } from '../../src/game/mafia-role';
import { GameInvalidPlayerCountException } from '../../src/common/error/game.invalid.player.count.exception';

function countRoleDistribution(gameRoles: Record<number, MAFIA_ROLE>) {
  return Object.values(gameRoles).reduce((acc, role) => {
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<MAFIA_ROLE, number>);
}

describe('RandomJobFactory 테스트', () => {

  let randomJobFactory: JobFactory;

  beforeEach(() => {
    randomJobFactory = new RandomJobFactory();
  });

  it('유저의 수가 6명일 때는 마피아 2명, 경찰 1명, 의사 0명, 시민 3명으로 구성된다', () => {
    //given
    const playerIds: Array<number> = [1, 2, 3, 4, 5, 6];

    //when
    const gameRoles: Record<number, MAFIA_ROLE> = randomJobFactory.allocateGameRoles(playerIds);

    //then
    const roleCounts: Record<MAFIA_ROLE, number> = countRoleDistribution(gameRoles);

    expect(roleCounts[MAFIA_ROLE.MAFIA]).toBe(2);
    expect(roleCounts[MAFIA_ROLE.POLICE]).toBe(1);
    expect(roleCounts[MAFIA_ROLE.DOCTOR]).toBeUndefined();
    expect(roleCounts[MAFIA_ROLE.CITIZEN]).toBe(3);
  });

  it('유저의 수가 7명일 때는 마피아 2명, 경찰 1명, 의사 1명, 시민 3명으로 구성된다', () => {
    //given
    const playerIds: Array<number> = [1, 2, 3, 4, 5, 6, 7];

    //when
    const gameRoles: Record<number, MAFIA_ROLE> = randomJobFactory.allocateGameRoles(playerIds);

    //then
    const roleCounts: Record<MAFIA_ROLE, number> = countRoleDistribution(gameRoles);

    expect(roleCounts[MAFIA_ROLE.MAFIA]).toBe(2);
    expect(roleCounts[MAFIA_ROLE.POLICE]).toBe(1);
    expect(roleCounts[MAFIA_ROLE.DOCTOR]).toBe(1);
    expect(roleCounts[MAFIA_ROLE.CITIZEN]).toBe(3);
  });

  it('유저의 수가 8명일 때는 마피아 3명, 경찰 1명, 의사 1명, 시민 3명으로 구성된다', () => {
    //given
    const playerIds: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8];

    //when
    const gameRoles: Record<number, MAFIA_ROLE> = randomJobFactory.allocateGameRoles(playerIds);

    //then
    const roleCounts: Record<MAFIA_ROLE, number> = countRoleDistribution(gameRoles);

    expect(roleCounts[MAFIA_ROLE.MAFIA]).toBe(3);
    expect(roleCounts[MAFIA_ROLE.POLICE]).toBe(1);
    expect(roleCounts[MAFIA_ROLE.DOCTOR]).toBe(1);
    expect(roleCounts[MAFIA_ROLE.CITIZEN]).toBe(3);
  });


  it.each([
    1, 2, 3, 4, 5, 9, 10,
  ])('유저의 수가 %i명일 때는 GameInvalidPlayerCountException 예외를 던진다', (count: number) => {
    const playerIds = Array.from({ length: count }, (_, i) => i + 1);

    expect(() => randomJobFactory.allocateGameRoles(playerIds))
      .toThrow(GameInvalidPlayerCountException);
  });
});
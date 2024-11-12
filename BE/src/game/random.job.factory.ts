import { JobFactory } from './job.factory';
import { MAFIA_ROLE } from './mafia-role';
import { Injectable } from '@nestjs/common';
import { GameInvalidPlayerCountException } from '../common/error/game.invalid.player.count.exception';
import { RoleCountNegativeException } from '../common/error/role.count.negative.exception';
import { GameRoom } from '../game-room/entity/game-room.model';
import { GameClient } from '../game-room/entity/game-client.model';

@Injectable()
export class RandomJobFactory implements JobFactory {
  /*
    유저가 6명일 때, 마피아 2, 경찰 1, 시민 3
    유저가 7명일 때, 마피아 2, 경찰 1, 의사 1, 시민 3
    유저가 8명일 때, 마피아 3, 경찰 1, 의사 1, 시민 3
   */
  allocateGameRoles(gameRoom: GameRoom): Record<GameClient, MAFIA_ROLE> {
    const userCount = gameRoom.clients.length;
    return this.allocate(userCount, gameRoom.clients);
  }

  private allocate(
    userCount: number,
    players: GameClient[],
  ): Record<GameClient, MAFIA_ROLE> {
    let possibleRoles: Array<MAFIA_ROLE>;
    switch (userCount) {
      case 6:
        possibleRoles = this.makeRoles(2, 1, 0, 3);
        break;
      case 7:
        possibleRoles = this.makeRoles(2, 1, 1, 3);
        break;
      case 8:
        possibleRoles = this.makeRoles(3, 1, 1, 3);
        break;
      default:
        throw new GameInvalidPlayerCountException();
    }
    const userRoles: Record<GameClient, MAFIA_ROLE> = {};
    const mafiaUsers: [GameClient, MAFIA_ROLE][] = [];
    this.shuffle(possibleRoles).forEach((role, idx) => {
      if (role === MAFIA_ROLE.MAFIA) {
        mafiaUsers.push([players[idx], role]);
      } else {
        players[idx].send('player-role', {
          'role': role,
          'another': null,
        });
      }
      userRoles[players[idx]] = role;
    });

    mafiaUsers.forEach(([currentPlayer, currentRole]) => {
      const otherMafias = mafiaUsers
        .filter((player) => player[0] !== currentPlayer)
        .map(([player, role]) => [player.client.socket.id, role]);

      currentPlayer.send('player-role', {
        'role': currentRole,
        'another': otherMafias,
      });
    });
    return userRoles;
  }

  private shuffle(possibleRoles: Array<MAFIA_ROLE>): Array<MAFIA_ROLE> {
    return possibleRoles.sort(() => Math.random() - 0.5);
  }

  private makeRoles(
    mafia: number,
    police: number,
    doctor: number,
    citizen: number,
  ): Array<MAFIA_ROLE> {
    this.verifyNegativeNumber(mafia, police, doctor, citizen);
    return [
      ...Array(mafia).fill(MAFIA_ROLE.MAFIA),
      ...Array(police).fill(MAFIA_ROLE.POLICE),
      ...Array(doctor).fill(MAFIA_ROLE.DOCTOR),
      ...Array(citizen).fill(MAFIA_ROLE.CITIZEN),
    ];
  }

  private verifyNegativeNumber(
    mafia: number,
    police: number,
    doctor: number,
    citizen: number,
  ) {
    if (mafia < 0 || police < 0 || doctor < 0 || citizen < 0) {
      throw new RoleCountNegativeException();
    }
  }
}

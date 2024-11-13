import { GameManager } from './game-manager';
import { Injectable } from '@nestjs/common';
import { GameRoom } from '../../../game-room/entity/game-room.model';
import { GameClient } from '../../../game-room/entity/game-client.model';
import { MAFIA_ROLE } from '../../mafia-role';
import { USER_STATUS } from '../../user-status';
import { NotFoundGameRoomException } from '../../../common/error/not.found.game-room.exception';
import { NotFoundBallotBoxException } from '../../../common/error/not.found.ballot-box.exception';
import { UnauthorizedUserBallotException } from '../../../common/error/unauthorized.user.ballot.exception';

interface PlayerInfo {
  role: MAFIA_ROLE;
  status: USER_STATUS;
}

/*
무효표도 넣기
무효표가 다수일 때 어떻게 해야할지?
죽은 유저는 하지 못하게 막아야 함
죽은 유저에게랑 살아있는 유저에게 보이는 투표 화면은 달라야 함
 */
@Injectable()
export class TotalGameManager implements GameManager {
  private readonly games = new Map<GameRoom, Map<GameClient, PlayerInfo>>();
  private readonly ballotBoxs = new Map<GameRoom, Map<GameClient, string[]>>();

  register(gameRoom: GameRoom, players: Map<GameClient, MAFIA_ROLE>): void {
    const gameInfo = new Map<GameClient, PlayerInfo>();

    players.forEach((role, gameClient) => {
      gameInfo.set(gameClient, {
        role, status: USER_STATUS.ALIVE,
      });
    });

    this.games.set(gameRoom, gameInfo);
  }

  private killUser(gameRoom: GameRoom, player: GameClient): void {
    const gameInfo = this.games.get(gameRoom);
    if (!gameInfo) {
      throw new NotFoundGameRoomException();
    }

    const playerInfo = gameInfo.get(player);

    playerInfo.status = USER_STATUS.DIE;
    gameInfo.set(player, playerInfo);

    console.log('투표로 죽은 해당 유저 죽은 사실 게임 방 유저들에게 소켓으로 보낼 예정');
  }

  registerBallotBox(gameRoom: GameRoom): void {
    const ballotBox = this.ballotBoxs.get(gameRoom);
    if (!ballotBox) {
      const gameInfo = this.games.get(gameRoom);
      if (!gameInfo) {
        throw new NotFoundGameRoomException();
      }

      const newBallotBox = new Map<GameClient, string[]>();
      gameInfo.forEach((playerInfo, client) => {
        if (playerInfo.status === USER_STATUS.ALIVE) {
          newBallotBox.set(client, []);
        }
      });
      // 무효표 추가
      newBallotBox.set(null, []);
      this.ballotBoxs.set(gameRoom, newBallotBox);
    }

    console.log('해당 방 유저들에게 투표 대상자를 소켓으로 보낼 예정');
  }

  /*
    무효표인 경우 to에 null로 보내면 됩니다.
   */
  cancelVote(gameRoom: GameRoom, from: GameClient, to: GameClient): void {
    const ballotBox = this.checkVoteAuthority(gameRoom, from);
    const toVotes = ballotBox.get(to);
    const fromSocketId = from.client.socket.id;
    const voteFlag = this.checkVote(ballotBox, fromSocketId);
    if (voteFlag) {
      ballotBox.set(to, toVotes.filter(voteId => voteId !== fromSocketId));

    }

    console.log('해당 방 유저들에게 현재 투표 상황 소켓으로 보낼 예정');
  }

  private checkVoteAuthority(gameRoom: GameRoom, from: GameClient) {
    const ballotBox = this.ballotBoxs.get(gameRoom);
    if (!ballotBox) {
      throw new NotFoundBallotBoxException();
    }
    if (this.games.get(gameRoom).get(from).status !== USER_STATUS.ALIVE) {
      throw new UnauthorizedUserBallotException();
    }
    return ballotBox;
  }

  /*
      무효표인 경우 to에 null로 보내면 됩니다.
     */
  vote(gameRoom: GameRoom, from: GameClient, to: GameClient): void {
    const ballotBox = this.checkVoteAuthority(gameRoom, from);
    const toVotes = ballotBox.get(to);
    const fromSocketId = from.client.socket.id;
    const voteFlag = this.checkVote(ballotBox, fromSocketId);
    if (!voteFlag) {
      toVotes.push(fromSocketId);
    }

    console.log('해당 방 유저들에게 현재 투표 상황 소켓으로 보낼 예정');
  }

  private checkVote(ballotBox: Map<GameClient, string[]>, fromSocketId: string) {
    let voteFlag = false;
    ballotBox.forEach((votedUser) => {
      if (votedUser.some(voteId => voteId === fromSocketId)) {
        voteFlag = true;
      }
    });
    return voteFlag;
  }

  primaryVoteResult(gameRoom: GameRoom): void {
    const ballotBox = this.ballotBoxs.get(gameRoom);
    if (!ballotBox) {
      throw new NotFoundBallotBoxException();
    }
    this.voteForYourself(ballotBox);

    const voteResult = new Map<string, number>();
    const newBalletBox = new Map<GameClient, string[]>();
    const maxVotedUsers = this.findMostVotedUser(ballotBox, voteResult);

    if ((maxVotedUsers.length === 1 && maxVotedUsers[0] !== null) || (maxVotedUsers.length > 1)) {
      /*
      투표결과가 1등이 있는 경우 혹은 공동이 있는 경우
       */
      maxVotedUsers.forEach((votedUser) => {
        if (votedUser !== null) {
          newBalletBox.set(votedUser, []);
        }
      });
      newBalletBox.set(null, []);
      this.ballotBoxs.set(gameRoom, newBalletBox);
      console.log('해당 방 유저들에게 현재 투표 결과 소켓으로 보낼 예정');
      gameRoom.sendAll('primary-game-manager-result', voteResult);
    }else{
      /*
    무효표가 1등인 경우
     */
      console.log('해당 방 유저들에게 무표효 1등 결과 소켓으로 보낼 예정');
    }
  }

  private findMostVotedUser(ballotBox: Map<GameClient, string[]>, voteResult: Map<string, number>) {
    let maxVotedUsers: GameClient[] = [];
    let maxCnt = -1;
    ballotBox.forEach((votedUsers, gameClient) => {
      voteResult[gameClient.client.socket.id] = votedUsers.length;
      if (maxCnt < votedUsers.length) {
        maxVotedUsers = [gameClient];
        maxCnt = votedUsers.length;
      } else if (maxCnt === votedUsers.length) {
        maxVotedUsers.push(gameClient);
      }
    });
    return maxVotedUsers;
  }

  private voteForYourself(ballotBox: Map<GameClient, string[]>) {
    ballotBox.forEach((votedUser, gameClient) => {
      const userId: string = gameClient.client.socket.id;
      const voteFlag: boolean = this.checkVote(ballotBox, userId);
      if (!voteFlag) {
        votedUser.push(userId);
      }
    });
  }

  finalVoteResult(gameRoom: GameRoom): void {
    const ballotBox = this.ballotBoxs.get(gameRoom);
    if (!ballotBox) {
      throw new NotFoundBallotBoxException();
    }
    const voteResult = new Map<string, number>();
    const mostVotedUser = this.findMostVotedUser(ballotBox, voteResult);

    /*
    투표가능한 유저 수 구하고 찬성 개수 비교해서 죽일지 살릴지 비교
    그리고 ballotBox 초기화
     */
    if (mostVotedUser.length === 1 && mostVotedUser[0] !== null) {
      this.killUser(gameRoom, mostVotedUser[0]);
    }
    this.ballotBoxs.set(gameRoom, null);
    console.log('웹 소켓을 활용하여 해당 방 유저들에게 결과를 보낼 예정');
  }
}
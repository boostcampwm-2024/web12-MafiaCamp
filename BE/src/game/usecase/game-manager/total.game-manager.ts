import { GameManager } from './game-manager';
import { Injectable } from '@nestjs/common';
import { GameRoom } from '../../../game-room/entity/game-room.model';
import { GameClient } from '../../../game-room/entity/game-client.model';
import { MAFIA_ROLE } from '../../mafia-role';
import { USER_STATUS } from '../../user-status';
import { NotFoundGameRoomException } from '../../../common/error/not.found.game-room.exception';
import { NotFoundBallotBoxException } from '../../../common/error/not.found.ballot-box.exception';
import { UnauthorizedUserBallotException } from '../../../common/error/unauthorized.user.ballot.exception';
import { MutexMap } from '../../../common/utils/mutex-map';

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
  private readonly games = new MutexMap<GameRoom, MutexMap<GameClient, PlayerInfo>>();
  private readonly ballotBoxs = new MutexMap<GameRoom, MutexMap<GameClient, string[]>>();

  async register(gameRoom: GameRoom, players: MutexMap<GameClient, MAFIA_ROLE>): Promise<void> {
    const gameInfo = new MutexMap<GameClient, PlayerInfo>();


    const entries = await players.entries();
    const playerInfoEntries = entries.map(([client, role]) => [
      client,
      { role, status: USER_STATUS.ALIVE },
    ]) as [GameClient, PlayerInfo][];
    await gameInfo.setMany(playerInfoEntries);

    await this.games.set(gameRoom, gameInfo);
  }

  private async killUser(gameRoom: GameRoom, player: GameClient): Promise<void> {
    const gameInfo = await this.games.get(gameRoom);
    if (!gameInfo) {
      throw new NotFoundGameRoomException();
    }

    const playerInfo = await gameInfo.get(player);

    playerInfo.status = USER_STATUS.DEAD;
    await gameInfo.set(player, playerInfo);

    console.log('투표로 죽은 해당 유저 죽은 사실 게임 방 유저들에게 소켓으로 보낼 예정');
  }

  async registerBallotBox(gameRoom: GameRoom): Promise<void> {
    const ballotBox = await this.ballotBoxs.get(gameRoom);
    if (!ballotBox) {
      const gameInfo = await this.games.get(gameRoom);
      if (!gameInfo) {
        throw new NotFoundGameRoomException();
      }

      const newBallotBox = new MutexMap<GameClient, string[]>();
      const entries = await gameInfo.entries();
      entries.map(async ([client, playerInfo]) => {
        if (playerInfo.status === USER_STATUS.ALIVE) {
          await newBallotBox.set(client, []);
        }
      });

      // 무효표 추가
      await newBallotBox.set(null, []);
      await this.ballotBoxs.set(gameRoom, newBallotBox);
    }

    console.log('해당 방 유저들에게 투표 대상자를 소켓으로 보낼 예정');
  }

  /*
    무효표인 경우 to에 null로 보내면 됩니다.
   */
  async cancelVote(gameRoom: GameRoom, from: GameClient, to: GameClient): Promise<void> {
    await this.checkVoteAuthority(gameRoom, from);
    const ballotBox = await this.ballotBoxs.get(gameRoom);
    const toVotes = await ballotBox.get(to);
    const fromSocketId = from.client.socket.id;
    const voteFlag = await this.checkVote(ballotBox, fromSocketId);
    if (voteFlag) {
      await ballotBox.set(to, toVotes.filter(voteId => voteId !== fromSocketId));
    }

    console.log('해당 방 유저들에게 현재 투표 상황 소켓으로 보낼 예정');
  }

  private async checkVoteAuthority(gameRoom: GameRoom, from: GameClient): Promise<void> {
    const game = await this.games.get(gameRoom);
    if (!game) {
      throw new NotFoundBallotBoxException();
    }

    const fromClientInfo = await game.get(from);
    if (fromClientInfo.status !== USER_STATUS.ALIVE) {
      throw new UnauthorizedUserBallotException();
    }
  }

  /*
      무효표인 경우 to에 null로 보내면 됩니다.
     */
  async vote(gameRoom: GameRoom, from: GameClient, to: GameClient): Promise<void> {
    await this.checkVoteAuthority(gameRoom, from);
    const ballotBox = await this.ballotBoxs.get(gameRoom);
    const toVotes = await ballotBox.get(to);
    const fromSocketId = from.client.socket.id;
    const voteFlag = await this.checkVote(ballotBox, fromSocketId);
    if (!voteFlag) {
      toVotes.push(fromSocketId);
    }

    console.log('해당 방 유저들에게 현재 투표 상황 소켓으로 보낼 예정');
  }

  private async checkVote(ballotBox: MutexMap<GameClient, string[]>, fromSocketId: string): Promise<boolean> {
    let voteFlag = false;
    await ballotBox.forEach((votedUser) => {
      if (votedUser.some(voteId => voteId === fromSocketId)) {
        voteFlag = true;
      }
    });
    return voteFlag;
  }

  async primaryVoteResult(gameRoom: GameRoom): Promise<void> {
    const ballotBox = await this.ballotBoxs.get(gameRoom);
    if (!ballotBox) {
      throw new NotFoundBallotBoxException();
    }
    await this.voteForYourself(ballotBox);

    const voteResult = new MutexMap<string, number>();
    const newBalletBox = new MutexMap<GameClient, string[]>();
    const maxVotedUsers = await this.findMostVotedUser(ballotBox, voteResult);

    if ((maxVotedUsers.length === 1 && maxVotedUsers[0] !== null) || (maxVotedUsers.length > 1)) {
      /*
      투표결과가 1등이 있는 경우 혹은 공동이 있는 경우
       */
      for (const votedUser of maxVotedUsers) {
        if (votedUser !== null) {
          await newBalletBox.set(votedUser, []);
        }
      }
      await newBalletBox.set(null, []);
      await this.ballotBoxs.set(gameRoom, newBalletBox);
      console.log('해당 방 유저들에게 현재 투표 결과 소켓으로 보낼 예정');
      gameRoom.sendAll('primary-game-manager-result', voteResult);
    } else {
      /*
    무효표가 1등인 경우
     */
      console.log('해당 방 유저들에게 무표효 1등 결과 소켓으로 보낼 예정');
    }
  }

  private async findMostVotedUser(ballotBox: MutexMap<GameClient, string[]>, voteResult: MutexMap<string, number>): Promise<GameClient[]> {
    let maxVotedUsers: GameClient[] = [];
    let maxCnt = -1;
    await ballotBox.forEach((votedUsers, gameClient) => {
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

  private async voteForYourself(ballotBox: MutexMap<GameClient, string[]>) {
    const entries = await ballotBox.entries();
    entries.map(async ([client,votedUsers])=>{
      const userId: string = client.client.socket.id;
      const voteFlag: boolean = await this.checkVote(ballotBox, userId);
      if (!voteFlag) {
        votedUsers.push(userId);
      }
    })
  }

  async finalVoteResult(gameRoom: GameRoom): Promise<void> {
    const ballotBox = await this.ballotBoxs.get(gameRoom);
    if (!ballotBox) {
      throw new NotFoundBallotBoxException();
    }
    const voteResult = new MutexMap<string, number>();
    const mostVotedUser = await this.findMostVotedUser(ballotBox, voteResult);

    /*
    투표가능한 유저 수 구하고 찬성 개수 비교해서 죽일지 살릴지 비교
    그리고 ballotBox 초기화
     */
    if (mostVotedUser.length === 1 && mostVotedUser[0] !== null) {
      await this.killUser(gameRoom, mostVotedUser[0]);
    }
    await this.ballotBoxs.delete(gameRoom);
    console.log('웹 소켓을 활용하여 해당 방 유저들에게 결과를 보낼 예정');
  }
}
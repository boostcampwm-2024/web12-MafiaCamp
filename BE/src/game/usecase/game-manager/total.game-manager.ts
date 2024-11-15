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
import { VOTE_STATE } from '../../vote-state';

interface PlayerInfo {
  role: MAFIA_ROLE;
  status: USER_STATUS;
}

@Injectable()
export class TotalGameManager implements GameManager {
  private readonly games = new Map<GameRoom, MutexMap<string, PlayerInfo>>();
  private readonly ballotBoxs = new Map<GameRoom, MutexMap<string, string[]>>();

  async register(gameRoom: GameRoom, players: MutexMap<GameClient, MAFIA_ROLE>): Promise<void> {
    const playerEntries = await players.entries();

    const gameInfo = new MutexMap<string, PlayerInfo>();

    const playerInfoEntries = playerEntries.map(([client, role]) => [
      client.nickname,
      { role, status: USER_STATUS.ALIVE },
    ]) as [string, PlayerInfo][];

    await gameInfo.setMany(playerInfoEntries);
    this.games.set(gameRoom, gameInfo);
  }

  private async killUser(gameRoom: GameRoom, player: string): Promise<void> {
    const gameInfo = this.games.get(gameRoom);
    if (!gameInfo) {
      throw new NotFoundGameRoomException();
    }

    const playerInfo = await gameInfo.get(player);

    playerInfo.status = USER_STATUS.DEAD;
    await gameInfo.set(player, playerInfo);

    gameRoom.sendAll('vote-kill-user', player);
  }

  async registerBallotBox(gameRoom: GameRoom): Promise<void> {
    const ballotBox = this.ballotBoxs.get(gameRoom);
    const candidates: string[] = ['INVALIDITY'];
    if (!ballotBox) {
      const gameInfo = this.games.get(gameRoom);
      if (!gameInfo) {
        throw new NotFoundGameRoomException();
      }
      const newBallotBox = new MutexMap<string, string[]>();
      const entries = await gameInfo.entries();
      entries.map(async ([client, playerInfo]) => {
        if (playerInfo.status === USER_STATUS.ALIVE) {
          await newBallotBox.set(client, []);
          candidates.push(client);
        }
      });
      // 무효표 추가
      await newBallotBox.set('INVALIDITY', []);
      console.log(newBallotBox);
      this.ballotBoxs.set(gameRoom, newBallotBox);
    }else{
      await ballotBox.forEach((votedUsers,client)=>{
        candidates.push(client);
      })
    }

    gameRoom.sendAll('send-vote-candidates', candidates);
  }

  /*
    무효표인 경우 to에 INVALIDITY로 보내면 됩니다.
   */
  async cancelVote(gameRoom: GameRoom, from: string, to: string): Promise<void> {
    await this.checkVoteAuthority(gameRoom, from);
    const ballotBox = this.ballotBoxs.get(gameRoom);
    const toVotes = await ballotBox.get(to);
    const voteFlag = await this.checkVote(ballotBox, from);
    if (voteFlag) {
      await ballotBox.set(to, toVotes.filter(voteId => voteId !== from));
    }
    await this.sendVoteCurrentState(ballotBox, gameRoom);
  }

  private async sendVoteCurrentState(ballotBox: MutexMap<string, string[]>, gameRoom: GameRoom) {
    const entries = await ballotBox.entries();
    const voteCountMap = new MutexMap<string, number>();
    entries.map(async ([client, votedUser]) => {
      await voteCountMap.set(client, votedUser.length);
    });

    gameRoom.sendAll('vote-current-state', voteCountMap);
  }

  private async checkVoteAuthority(gameRoom: GameRoom, from: string): Promise<void> {
    const game = this.games.get(gameRoom);
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
  async vote(gameRoom: GameRoom, from: string, to: string): Promise<void> {
    await this.checkVoteAuthority(gameRoom, from);
    const ballotBox = this.ballotBoxs.get(gameRoom);
    const toVotes = await ballotBox.get(to);
    const voteFlag = await this.checkVote(ballotBox, from);
    if (!voteFlag) {
      toVotes.push(from);
    }

    await this.sendVoteCurrentState(ballotBox, gameRoom);
  }

  private async checkVote(ballotBox: MutexMap<string, string[]>, fromInfo: string): Promise<boolean> {
    let voteFlag = false;
    await ballotBox.forEach((votedUser) => {
      if (votedUser.some(voteId => voteId === fromInfo)) {
        voteFlag = true;
      }
    });
    return voteFlag;
  }

  async primaryVoteResult(gameRoom: GameRoom): Promise<VOTE_STATE> {
    const ballotBox = this.ballotBoxs.get(gameRoom);
    if (!ballotBox) {
      throw new NotFoundBallotBoxException();
    }
    await this.voteForYourself(ballotBox);

    const voteResult = new MutexMap<string, number>();
    const newBalletBox = new MutexMap<string, string[]>();
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
      await newBalletBox.set('INVALIDITY', []);
      this.ballotBoxs.set(gameRoom, newBalletBox);
      gameRoom.sendAll('primary-vote-result', voteResult);
      return VOTE_STATE.PRIMARY;
    }
    gameRoom.sendAll('primary-vote-result', voteResult);
    return VOTE_STATE.INVALIDITY;
  }

  private async findMostVotedUser(ballotBox: MutexMap<string, string[]>, voteResult: MutexMap<string, number>): Promise<string[]> {
    let maxVotedUsers: string[] = [];
    let maxCnt = -1;
    await ballotBox.forEach((votedUsers, client) => {
      voteResult[client] = votedUsers.length;
      if (maxCnt < votedUsers.length) {
        maxVotedUsers = [client];
        maxCnt = votedUsers.length;
      } else if (maxCnt === votedUsers.length) {
        maxVotedUsers.push(client);
      }
    });
    return maxVotedUsers;
  }

  private async voteForYourself(ballotBox: MutexMap<string, string[]>) {
    const entries = await ballotBox.entries();
    entries.map(async ([client, votedUsers]) => {
      const voteFlag: boolean = await this.checkVote(ballotBox, client);
      if (!voteFlag) {
        votedUsers.push(client);
      }
    });
  }

  async finalVoteResult(gameRoom: GameRoom): Promise<VOTE_STATE> {
    const ballotBox = this.ballotBoxs.get(gameRoom);
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
    this.ballotBoxs.delete(gameRoom);
    gameRoom.sendAll('final-vote-result', voteResult);
    return VOTE_STATE.FINAL;
  }
}
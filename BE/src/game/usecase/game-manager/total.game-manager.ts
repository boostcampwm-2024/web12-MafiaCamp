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
  private readonly games = new MutexMap<GameRoom, Map<string, PlayerInfo>>();
  private readonly ballotBoxs = new MutexMap<GameRoom, Map<string, string[]>>();

  async register(gameRoom: GameRoom, players: Map<GameClient, MAFIA_ROLE>): Promise<void> {
    if (!await this.games.get(gameRoom)) {

      const gameInfo = new Map<string, PlayerInfo>();
      players.forEach((role, client) => {
        gameInfo.set(client.nickname, { role, status: USER_STATUS.ALIVE });
      });

      await this.games.set(gameRoom, gameInfo);
    }
  }

  private async killUser(gameRoom: GameRoom, player: string): Promise<void> {
    const gameInfo = await this.games.get(gameRoom);
    if (!gameInfo) {
      throw new NotFoundGameRoomException();
    }

    const playerInfo = gameInfo.get(player);

    playerInfo.status = USER_STATUS.DEAD;
    gameInfo.set(player, playerInfo);

    gameRoom.sendAll('vote-kill-user', player);
  }

  async registerBallotBox(gameRoom: GameRoom): Promise<void> {
    const ballotBox = await this.ballotBoxs.get(gameRoom);
    const candidates: string[] = ['INVALIDITY'];
    if (!ballotBox) {
      const gameInfo = await this.games.get(gameRoom);
      if (!gameInfo) {
        throw new NotFoundGameRoomException();
      }
      const newBallotBox = new Map<string, string[]>();
      gameInfo.forEach((playerInfo, client) => {
        if (playerInfo.status === USER_STATUS.ALIVE) {
          newBallotBox.set(client, []);
          candidates.push(client);
        }
      });
      // 무효표 추가
      newBallotBox.set('INVALIDITY', []);
      await this.ballotBoxs.set(gameRoom, newBallotBox);
    } else {
      ballotBox.forEach((votedUsers, client) => {
        candidates.push(client);
      });
    }

    gameRoom.sendAll('send-vote-candidates', candidates);
  }

  /*
    무효표인 경우 to에 INVALIDITY로 보내면 됩니다.
   */
  async cancelVote(gameRoom: GameRoom, from: string, to: string): Promise<void> {
    await this.checkVoteAuthority(gameRoom, from);
    const ballotBox = await this.ballotBoxs.get(gameRoom);
    const toVotes = ballotBox.get(to);
    const voteFlag = this.checkVote(ballotBox, from);
    if (voteFlag) {
      ballotBox.set(to, toVotes.filter(voteId => voteId !== from));
    }
    this.sendVoteCurrentState(ballotBox, gameRoom);
  }

  private sendVoteCurrentState(ballotBox: Map<string, string[]>, gameRoom: GameRoom) {
    const voteCountMap = new Map<string, number>();
    ballotBox.forEach((votedUsers, client) => {
      voteCountMap.set(client, votedUsers.length);
    });
    gameRoom.sendAll('vote-current-state', voteCountMap);
  }

  private async checkVoteAuthority(gameRoom: GameRoom, from: string): Promise<void> {
    const game = await this.games.get(gameRoom);
    if (!game) {
      throw new NotFoundBallotBoxException();
    }

    const fromClientInfo = game.get(from);
    if (fromClientInfo.status !== USER_STATUS.ALIVE) {
      throw new UnauthorizedUserBallotException();
    }
  }

  /*
      무효표인 경우 to에 null로 보내면 됩니다.
     */
  async vote(gameRoom: GameRoom, from: string, to: string): Promise<void> {
    await this.checkVoteAuthority(gameRoom, from);
    const ballotBox = await this.ballotBoxs.get(gameRoom);
    const toVotes = ballotBox.get(to);
    const voteFlag = this.checkVote(ballotBox, from);
    if (!voteFlag) {
      toVotes.push(from);
    }
    await this.sendVoteCurrentState(ballotBox, gameRoom);
  }

  private checkVote(ballotBox: Map<string, string[]>, fromInfo: string): boolean {
    let voteFlag = false;
    ballotBox.forEach((votedUser) => {
      if (votedUser.some(voteId => voteId === fromInfo)) {
        voteFlag = true;
      }
    });
    return voteFlag;
  }

  async primaryVoteResult(gameRoom: GameRoom): Promise<VOTE_STATE> {
    const ballotBox = await this.ballotBoxs.get(gameRoom);
    if (!ballotBox) {
      throw new NotFoundBallotBoxException();
    }
    await this.voteForYourself(ballotBox);

    const voteResult = new Map<string, number>();
    const newBalletBox = new Map<string, string[]>();
    const maxVotedUsers = this.findMostVotedUser(ballotBox, voteResult);

    if ((maxVotedUsers.length === 1 && maxVotedUsers[0] !== null) || (maxVotedUsers.length > 1)) {
      /*
      투표결과가 1등이 있는 경우 혹은 공동이 있는 경우
       */
      maxVotedUsers.forEach((votedUser)=>{
        if (votedUser !== null) {
          newBalletBox.set(votedUser, []);
        }
      })
      newBalletBox.set('INVALIDITY', []);
      await this.ballotBoxs.set(gameRoom, newBalletBox);
      gameRoom.sendAll('primary-vote-result', voteResult);
      return VOTE_STATE.PRIMARY;
    }
    gameRoom.sendAll('primary-vote-result', voteResult);
    return VOTE_STATE.INVALIDITY;
  }

  private findMostVotedUser(ballotBox: Map<string, string[]>, voteResult: Map<string, number>): string[] {
    let maxVotedUsers: string[] = [];
    let maxCnt = -1;
    ballotBox.forEach((votedUsers, client) => {
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

  private voteForYourself(ballotBox: Map<string, string[]>) {
    ballotBox.forEach((votedUsers, client) => {
      if (!this.checkVote(ballotBox, client)) {
        votedUsers.push(client);
      }
    });
  }

  async finalVoteResult(gameRoom: GameRoom): Promise<VOTE_STATE> {
    const ballotBox = await this.ballotBoxs.get(gameRoom);
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
      await this.killUser(gameRoom, mostVotedUser[0]);
    }
    await this.ballotBoxs.delete(gameRoom);
    gameRoom.sendAll('final-vote-result', voteResult);
    return VOTE_STATE.FINAL;
  }
}
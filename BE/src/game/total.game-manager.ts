import { VoteManager } from './usecase/vote-manager/vote-manager';
import { Inject, Injectable } from '@nestjs/common';
import { GameRoom } from '../game-room/entity/game-room.model';
import { GameClient } from '../game-room/entity/game-client.model';
import { MAFIA_ROLE } from './mafia-role';
import { USER_STATUS } from './user-status';
import { NotFoundGameRoomException } from '../common/error/not.found.game-room.exception';
import { NotFoundBallotBoxException } from '../common/error/not.found.ballot-box.exception';
import { UnauthorizedUserBallotException } from '../common/error/unauthorized.user.ballot.exception';
import { VOTE_STATE } from './vote-state';
import { PoliceManager } from './usecase/role-playing/police-manager';
import { GAME_HISTORY_RESULT } from './entity/game-history.result';
import { MafiaManager } from './usecase/role-playing/mafia-manager';
import { NotFoundUserException } from '../common/error/not.found.user.exception';
import { FinishGameManager } from './usecase/finish-game/finish-game.manager';
import { GAME_USER_RESULT } from 'src/game-user/entity/game-user.result';
import { GAME_HISTORY_REPOSITORY, GameHistoryRepository } from './repository/game-history.repository';
import { GameHistoryEntity } from './entity/game-history.entity';
import { GAME_STATUS } from './entity/game-status';
import { CanNotSelectUserException } from '../common/error/can-not.select.exception';
import { UnauthorizedSelectException } from '../common/error/unauthorized.select.exception';
import { DoctorManager } from './usecase/role-playing/doctor-manager';
import { KILL_OPTION } from './killOption-status';
import { NotFoundMafiaSelectLogException } from '../common/error/not.found.mafia.select.log.exception';
import { KillDecisionManager } from './usecase/role-playing/killDecision-manager';
import { LockManager } from '../common/utils/lock-manager';
import { DetectManager } from './usecase/detect-early-quit/detect.manager';
import { EventClient } from '../event/event-client.model';

interface PlayerInfo {
  role: MAFIA_ROLE;
  status: USER_STATUS;
}

interface MafiaSelectLogEntry {
  target: string;
  shouldBeKilled: boolean;
}

@Injectable()
export class TotalGameManager
  implements VoteManager,
    PoliceManager,
    MafiaManager,
    DoctorManager,
    KillDecisionManager,
    FinishGameManager,
    DetectManager {
  private readonly lockManager = new LockManager<string>();
  private readonly games = new Map<string, Map<string, PlayerInfo>>();
  private readonly ballotBoxs = new Map<string, Map<string, string[]>>();
  private readonly mafiaCurrentTarget = new Map<string, string>();
  private readonly mafiaSelectLogs = new Map<string, MafiaSelectLogEntry[]>();

  constructor(
    @Inject(GAME_HISTORY_REPOSITORY)
    private readonly gameHistoryRepository: GameHistoryRepository<
      GameHistoryEntity,
      number
    >,
  ) {
  }

  async register(
    gameRoom: GameRoom,
    players: Map<GameClient, MAFIA_ROLE>,
  ): Promise<void> {
    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      if (this.games.has(gameRoom.roomId)) {
        return;
      }

      const gameInfo = new Map<string, PlayerInfo>();
      players.forEach((role, client) => {
        gameInfo.set(client.nickname, { role, status: USER_STATUS.ALIVE });
        client.job = role;
        if (role === MAFIA_ROLE.MAFIA) {
          gameRoom.addMafia(client);
        }
      });
      this.games.set(gameRoom.roomId, gameInfo);
    });
  }

  private killUser(
    gameRoom: GameRoom,
    player: string,
    option: KILL_OPTION = KILL_OPTION.VOTE,
  ): void {
    const gameInfo = this.games.get(gameRoom.roomId);
    if (!gameInfo) {
      throw new NotFoundGameRoomException();
    }

    const playerInfo = gameInfo.get(player);

    playerInfo.status = USER_STATUS.DEAD;
    gameInfo.set(player, playerInfo);

    if (option === KILL_OPTION.VOTE)
      gameRoom.sendAll('vote-kill-user', { player, job: playerInfo.role });

    if (option === KILL_OPTION.MAFIA_KILL)
      gameRoom.sendAll('mafia-kill-result', { player, job: playerInfo.role });
  }

  async registerBallotBox(gameRoom: GameRoom): Promise<void> {
    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      const ballotBox = this.ballotBoxs.get(gameRoom.roomId);
      const candidates: string[] = [];
      if (!ballotBox) {
        const gameInfo = this.games.get(gameRoom.roomId);
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
        candidates.push('INVALIDITY');
        newBallotBox.set('INVALIDITY', []);
        this.ballotBoxs.set(gameRoom.roomId, newBallotBox);
      } else {
        ballotBox.forEach((votedUsers, client) => {
          candidates.push(client);
        });
      }

      gameRoom.sendAll('send-vote-candidates', candidates);
    });
  }

  /*
    무효표인 경우 to에 INVALIDITY로 보내면 됩니다.
   */
  async cancelVote(
    gameRoom: GameRoom,
    from: string,
    to: string,
  ): Promise<void> {
    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      this.checkVoteAuthority(gameRoom, from);
      const ballotBox = this.ballotBoxs.get(gameRoom.roomId);
      const toVotes = ballotBox.get(to);
      const voteFlag = this.checkVote(ballotBox, from);
      if (voteFlag) {
        ballotBox.set(
          to,
          toVotes.filter((voteId) => voteId !== from),
        );
      }
      this.sendVoteCurrentState(ballotBox, gameRoom);
    });
  }

  private sendVoteCurrentState(
    ballotBox: Map<string, string[]>,
    gameRoom: GameRoom,
  ) {
    const voteCountMap: Record<string, number> = {};
    ballotBox.forEach((votedUsers, client) => {
      voteCountMap[client] = votedUsers.length;
    });
    gameRoom.sendAll('vote-current-state', voteCountMap);
  }

  private checkVoteAuthority(gameRoom: GameRoom, from: string): void {
    const game = this.games.get(gameRoom.roomId);
    if (!game) {
      throw new NotFoundBallotBoxException();
    }

    const fromClientInfo = game.get(from);
    if (fromClientInfo.status !== USER_STATUS.ALIVE) {
      throw new UnauthorizedUserBallotException();
    }
  }

  async vote(gameRoom: GameRoom, from: string, to: string): Promise<void> {
    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      this.checkVoteAuthority(gameRoom, from);
      const ballotBox = this.ballotBoxs.get(gameRoom.roomId);
      const toVotes = ballotBox.get(to);
      const voteFlag = this.checkVote(ballotBox, from);
      if (!voteFlag) {
        toVotes.push(from);
        ballotBox.set(to, toVotes);
      }
      this.sendVoteCurrentState(ballotBox, gameRoom);
    });
  }

  private checkVote(
    ballotBox: Map<string, string[]>,
    fromInfo: string,
  ): boolean {
    let voteFlag = false;
    ballotBox.forEach((votedUser) => {
      if (votedUser.some((voteId) => voteId === fromInfo)) {
        voteFlag = true;
      }
    });
    return voteFlag;
  }

  async primaryVoteResult(gameRoom: GameRoom): Promise<VOTE_STATE> {
    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      const ballotBox = this.ballotBoxs.get(gameRoom.roomId);
      if (!ballotBox) {
        throw new NotFoundBallotBoxException();
      }
      this.voteForYourself(ballotBox);

      const newBalletBox = new Map<string, string[]>();
      const maxVotedUsers = this.findMostVotedUser(ballotBox);

      if (
        (maxVotedUsers.length === 1 && maxVotedUsers[0] !== 'INVALIDITY') ||
        maxVotedUsers.length > 1
      ) {
        /*
        투표결과가 1등이 있는 경우 혹은 공동이 있는 경우
         */
        maxVotedUsers.forEach((votedUser) => {
          if (votedUser !== 'INVALIDITY') {
            newBalletBox.set(votedUser, []);
          }
        });
        newBalletBox.set('INVALIDITY', []);
        this.ballotBoxs.set(gameRoom.roomId, newBalletBox);
        gameRoom.sendAll('primary-vote-result', maxVotedUsers);
        return VOTE_STATE.PRIMARY;
      }
      gameRoom.sendAll('primary-vote-result', maxVotedUsers);
      this.ballotBoxs.delete(gameRoom.roomId);
      return VOTE_STATE.INVALIDITY;
    });
  }

  private findMostVotedUser(ballotBox: Map<string, string[]>): string[] {
    let maxVotedUsers: string[] = [];
    let maxCnt = -1;
    ballotBox.forEach((votedUsers, client) => {
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
      if (!this.checkVote(ballotBox, client) && client !== 'INVALIDITY') {
        votedUsers.push(client);
      }
    });
  }

  async finalVoteResult(gameRoom: GameRoom): Promise<VOTE_STATE> {
    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      const ballotBox = this.ballotBoxs.get(gameRoom.roomId);
      if (!ballotBox) {
        throw new NotFoundBallotBoxException();
      }
      const mostVotedUser = this.findMostVotedUser(ballotBox);

      this.ballotBoxs.delete(gameRoom.roomId);

      if (mostVotedUser.length === 1 && mostVotedUser[0] !== 'INVALIDITY') {
        this.killUser(gameRoom, mostVotedUser[0]);
      } else {
        gameRoom.sendAll('vote-kill-user', null);
      }
      return VOTE_STATE.FINAL;
    });
  }

  async isPoliceAlive(gameRoom: GameRoom): Promise<boolean> {
    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      const gameInfo = this.games.get(gameRoom.roomId);
      if (!gameInfo) {
        throw new NotFoundGameRoomException();
      }

      return Array.from(gameInfo.values()).some(
        (playerInfo) =>
          playerInfo.role === MAFIA_ROLE.POLICE &&
          playerInfo.status === USER_STATUS.ALIVE,
      );
    });
  }

  async executePolice(
    gameRoom: GameRoom,
    police: string,
    criminal: string,
  ): Promise<void> {
    let policeFlag = false;
    let criminalFlag = false;
    let criminalJob: MAFIA_ROLE;

    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      const userInfos = this.games.get(gameRoom.roomId);
      userInfos.forEach((playerInfo, client) => {
        if (
          police === client &&
          playerInfo.role === MAFIA_ROLE.POLICE &&
          playerInfo.status === USER_STATUS.ALIVE
        ) {
          policeFlag = true;
        } else if (
          criminal === client &&
          playerInfo.status === USER_STATUS.ALIVE
        ) {
          criminalFlag = true;
          criminalJob = playerInfo.role;
        }
      });
      if (policeFlag && criminalFlag) {
        const policeClient = gameRoom.clients.find(
          (client) => client.nickname === police,
        );
        if (policeClient) {
          policeClient.send('police-investigation-result', {
            criminal,
            criminalJob,
          });
        }
      }
    });
  }

  async selectMafiaTarget(
    gameRoom: GameRoom,
    from: string,
    killTarget: string,
  ): Promise<void> {
    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      const gameInfo = this.games.get(gameRoom.roomId);
      if (!gameInfo) {
        throw new NotFoundGameRoomException();
      }
      const targetInfo = gameInfo.get(killTarget);
      const fromClientInfo = gameInfo.get(from);

      if (!targetInfo || !fromClientInfo) {
        throw new NotFoundUserException();
      }

      if (targetInfo.status !== USER_STATUS.ALIVE) {
        throw new CanNotSelectUserException();
      }

      if (targetInfo.role === MAFIA_ROLE.MAFIA) {
        throw new CanNotSelectUserException('마피아는 선택할 수 없습니다.');
      }

      if (
        fromClientInfo.status !== USER_STATUS.ALIVE ||
        fromClientInfo.role !== MAFIA_ROLE.MAFIA
      ) {
        throw new UnauthorizedSelectException();
      }

      this.mafiaCurrentTarget.set(gameRoom.roomId, killTarget);
      this.sendCurrentMafiaTarget(killTarget, gameRoom);
    });
  }

  private sendCurrentMafiaTarget(killTarget: string, gameRoom: GameRoom): void {
    gameRoom.sendToRole(MAFIA_ROLE.MAFIA, 'mafia-current-target', killTarget);
  }

  async initMafia(gameRoom: GameRoom): Promise<void> {
    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      this.mafiaCurrentTarget.set(gameRoom.roomId, 'NO_SELECTION');
      this.mafiaSelectLogs.set(gameRoom.roomId, []);
    });
  }

  async decisionMafiaTarget(gameRoom: GameRoom): Promise<void> {
    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      const selectLog = this.mafiaSelectLogs.get(gameRoom.roomId);
      const finalTarget = this.mafiaCurrentTarget.get(gameRoom.roomId);

      if (!finalTarget) {
        throw new NotFoundUserException();
      }

      if (!selectLog) {
        throw new NotFoundMafiaSelectLogException();
      }

      const updateSelectLogs: MafiaSelectLogEntry[] = [
        ...(selectLog || []),
        { target: finalTarget, shouldBeKilled: true },
      ];

      this.mafiaSelectLogs.set(gameRoom.roomId, updateSelectLogs);
      this.mafiaCurrentTarget.delete(gameRoom.roomId);
    });
  }

  async isDoctorAlive(gameRoom: GameRoom): Promise<boolean> {
    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      const gameInfo = this.games.get(gameRoom.roomId);
      if (!gameInfo) {
        throw new NotFoundGameRoomException();
      }
      return Array.from(gameInfo.values()).some(
        (playerInfo) =>
          playerInfo.role === MAFIA_ROLE.DOCTOR &&
          playerInfo.status === USER_STATUS.ALIVE,
      );
    });
  }

  async selectDoctorTarget(
    gameRoom: GameRoom,
    from: string,
    saveTarget: string,
  ): Promise<void> {
    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      const gameInfo = this.games.get(gameRoom.roomId);
      if (!gameInfo) {
        throw new NotFoundGameRoomException();
      }
      const targetInfo = gameInfo.get(saveTarget);
      const fromClientInfo = gameInfo.get(from);

      if (!targetInfo || !fromClientInfo) {
        throw new NotFoundUserException();
      }

      if (targetInfo.status !== USER_STATUS.ALIVE) {
        throw new CanNotSelectUserException();
      }

      if (
        fromClientInfo.status !== USER_STATUS.ALIVE ||
        fromClientInfo.role !== MAFIA_ROLE.DOCTOR
      ) {
        throw new UnauthorizedSelectException();
      }
      await this.decisionSurvivorByDoctor(gameRoom, saveTarget);
    });
  }

  async decisionSurvivorByDoctor(
    gameRoom: GameRoom,
    saveTarget: string,
  ): Promise<void> {
    const mafiaSelectLog = this.mafiaSelectLogs.get(gameRoom.roomId);

    if (!mafiaSelectLog || mafiaSelectLog.length === 0) {
      throw new NotFoundMafiaSelectLogException();
    }

    if (mafiaSelectLog[mafiaSelectLog.length - 1].target === saveTarget) {
      const lastLog = mafiaSelectLog[mafiaSelectLog.length - 1];
      if (lastLog.shouldBeKilled) {
        lastLog.shouldBeKilled = false;
        this.mafiaSelectLogs.set(gameRoom.roomId, mafiaSelectLog);
      }
    }
  }

  async determineKillTarget(gameRoom: GameRoom): Promise<void> {
    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      const mafiaSelectLog = this.mafiaSelectLogs.get(gameRoom.roomId);
      if (!mafiaSelectLog || mafiaSelectLog.length === 0) {
        throw new NotFoundMafiaSelectLogException();
      }

      const lastLog = mafiaSelectLog[mafiaSelectLog.length - 1];
      if (!lastLog || !lastLog.target) {
        throw new NotFoundMafiaSelectLogException();
      }

      if (!lastLog.shouldBeKilled || lastLog.target === 'NO_SELECTION') {
        return gameRoom.sendAll('mafia-kill-result', null);
      }

      this.killUser(gameRoom, lastLog.target, KILL_OPTION.MAFIA_KILL);
    });
  }

  async checkFinishCondition(gameRoom: GameRoom): Promise<GAME_HISTORY_RESULT> {
    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      const gameInfo = this.games.get(gameRoom.roomId);
      if (!gameInfo) {
        throw new NotFoundGameRoomException();
      }
      let mafiaCount = 0;
      let citizenCount = 0;
      gameInfo.forEach((playerInfo) => {
        if (playerInfo.status === USER_STATUS.DEAD) {
          return;
        }
        if (playerInfo.role === MAFIA_ROLE.MAFIA) {
          mafiaCount++;
        } else {
          citizenCount++;
        }
      });

      if (mafiaCount === 0) {
        return GAME_HISTORY_RESULT.CITIZEN;
      }
      if (mafiaCount >= citizenCount) {
        return GAME_HISTORY_RESULT.MAFIA;
      }
      return null;
    });
  }

  async finishGame(gameRoom: GameRoom): Promise<void> {
    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      this.sendResultToClient(gameRoom);
      await this.saveGameResult(gameRoom);
      const roomId = gameRoom.roomId;
      this.games.delete(roomId);
      this.ballotBoxs.delete(roomId);
      this.mafiaCurrentTarget.delete(roomId);
      this.mafiaSelectLogs.delete(roomId);
      gameRoom.reset();
    });
  }

  private sendResultToClient(gameRoom: GameRoom) {
    const gameInfo = this.games.get(gameRoom.roomId);
    if (!gameInfo) {
      throw new NotFoundGameRoomException();
    }
    const playerInfo = [...gameInfo.entries()].map(([nickname, data]) => ({
      nickname,
      ...data,
    }));

    const result = gameRoom.result;
    const clients = gameRoom.clients;
    clients.forEach((c) => {
      const winOrLose =
        result === GAME_HISTORY_RESULT.MAFIA
          ? c.job === MAFIA_ROLE.MAFIA
          : c.job !== MAFIA_ROLE.MAFIA;
      c.send('game-result', {
        result: winOrLose ? GAME_USER_RESULT.WIN : GAME_USER_RESULT.LOSE,
        playerInfo,
      });
    });
  }

  private async saveGameResult(gameRoom: GameRoom) {
    const gameId = gameRoom.gameId;
    const endTime = new Date();
    const gameHistoryResult = gameRoom.result;
    const gameStatus = GAME_STATUS.END;
    await this.gameHistoryRepository.saveGameResult(gameId, {
      endTime,
      gameHistoryResult,
      gameStatus,
    }); // 게임 상태 업데이트
  }

  async detect(gameRoom: GameRoom, client: EventClient): Promise<boolean> {
    return await this.lockManager.withKeyLock(gameRoom.roomId, async () => {
      const playerInfos = this.games.get(gameRoom.roomId);
      const ballot = this.ballotBoxs.get(gameRoom.roomId);
      for (const [nickname,] of playerInfos) {
        if (nickname === client.nickname) {
          playerInfos.delete(nickname);
          if (ballot) {
            ballot.delete(nickname);
            this.ballotBoxs.set(gameRoom.roomId, ballot);
          }
          this.games.set(gameRoom.roomId, playerInfos);
          return true;
        }
      }
      return false;
    });
  }
}

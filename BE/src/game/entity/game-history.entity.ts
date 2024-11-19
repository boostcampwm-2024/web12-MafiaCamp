import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GAME_STATUS } from './game-status';
import { GAME_HISTORY_RESULT } from './game-history.result';
import { GameUserEntity } from '../../game-user/entity/game-user.entity';

@Entity('game_history')
export class GameHistoryEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'game_id',
  })
  gameId: number;

  @CreateDateColumn({
    type: 'datetime',
    name: 'start_time',
    nullable: false,
  })
  startTime: Date;

  @CreateDateColumn({
    type: 'datetime',
    name: 'end_time',
    nullable: true,
  })
  endTime: Date;

  @Column({
    type: 'enum',
    name: 'game_history_result',
    enum: GAME_HISTORY_RESULT,
    nullable: true,
  })
  gameHistoryResult: GAME_HISTORY_RESULT;

  @Column({
    type: 'enum',
    name: 'game_status',
    enum: GAME_STATUS,
    nullable: false,
  })
  gameStatus: GAME_STATUS;

  @OneToMany(() => GameUserEntity, (gameUser) => gameUser.gameHistory)
  gameUsers: Array<GameUserEntity>;

  constructor() {
    this.startTime = new Date();
    this.gameStatus = GAME_STATUS.PROGRESS;
  }

  changeStatusToEnd() {
    if (this.gameStatus == GAME_STATUS.PROGRESS) {
      this.gameStatus = GAME_STATUS.END;
    }
  }
}

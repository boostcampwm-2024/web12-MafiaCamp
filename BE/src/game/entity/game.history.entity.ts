import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GameHistoryResult } from './game.history.result';
import { GameStatus } from './game.status';

@Entity('game_history')
export class GameHistoryEntity {

  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'game_id',
  })
  gameId: number;

  @Column({
    type: 'datetime',
    name: 'start_time',
    nullable: false,
  })
  startTime: Date;

  @Column({
    type: 'datetime',
    name: 'end_time',
    nullable: true,
  })
  endTime: Date;

  @Column({
    type: 'enum',
    name: 'game_history_result',
    enum: GameHistoryResult,
    nullable: true,
  })
  gameHistoryResult: GameHistoryResult;

  @Column({
    type: 'enum',
    name: 'game_status',
    enum: GameStatus,
    nullable: false,
  })
  gameStatus: GameStatus;


  constructor() {
    this.startTime = new Date();
    this.gameStatus = GameStatus.PROGRESS;
  }

  changeStatusToEnd() {
    if (this.gameStatus == GameStatus.PROGRESS) {
      this.gameStatus = GameStatus.END;
    }
  }
}
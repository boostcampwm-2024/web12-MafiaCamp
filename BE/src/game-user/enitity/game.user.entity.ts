import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { MAFIA_ROLE } from '../../game/mafia.role';
import { GAME_USER_RESULT } from './game.user.result';
import { GameHistoryEntity } from '../../game/entity/game.history.entity';
import { UserEntity } from '../../user/entity/user.entity';

@Entity("game_user")
export class GameUserEntity {

  @PrimaryColumn({
    type: 'bigint',
    name: 'game_id',
  })
  gameId: number;

  @PrimaryColumn({
    type: 'bigint',
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'enum',
    name: 'job',
    enum: MAFIA_ROLE,
    nullable: true,
  })
  job: MAFIA_ROLE;

  @Column({
    type:'enum',
    name:'game_user_result',
    enum:GAME_USER_RESULT,
    nullable:true
  })
  gameUserResult:GAME_USER_RESULT;

  @ManyToOne(
    () => GameHistoryEntity,
    gameHistory => gameHistory.gameUsers,
    {
      onDelete: 'CASCADE',
    })
  gameHistory: GameHistoryEntity;

  @ManyToOne(
    () => UserEntity,
    user => user.gameUsers,
    {
      onDelete: 'CASCADE',
    })
  user: UserEntity;

  private constructor(gameHistory: GameHistoryEntity, user: UserEntity) {
    this.gameHistory = gameHistory;
    this.user = user;
  }

  static create(gameHistory: GameHistoryEntity, user: UserEntity) : GameUserEntity{
    return new GameUserEntity(gameHistory, user);
  }
}
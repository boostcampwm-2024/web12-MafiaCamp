import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'varchar',
    name: 'email',
    unique: true,
    nullable: false,
  })
  @Index('idx_email', { unique: true })
  email: string;

  @Column({
    type: 'varchar',
    name: 'nickname',
    nullable: false,
  })
  nickname: string;

  @Column({
    type: 'varchar',
    name: 'oauth_id',
    nullable: false,
  })
  oAuthId: string;

  @Column({
    type: 'int',
    name: 'score',
    nullable: false,
  })
  score: number;


  @Column({
    type: 'datetime',
    name: 'created_at',
    nullable: false,
  })
  @Index('idx_created_at')
  createdAt: Date;


  private constructor(email: string, nickname: string, oAuthId: string, score: number, createdAt: Date) {
    this.email = email;
    this.nickname = nickname;
    this.oAuthId = oAuthId;
    this.score = score;
    this.createdAt = createdAt;
  }

  static make(email: string, nickname: string, oAuthId: string): UserEntity {
    return new UserEntity(email, nickname, oAuthId, 0, new Date());
  }
}
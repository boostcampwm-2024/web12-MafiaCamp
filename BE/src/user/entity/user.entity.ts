import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GameUserEntity } from '../../game-user/entity/game-user.entity';
import { NotFoundUserException } from '../../common/error/not.found.user.exception';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class UserEntity extends BaseEntity {
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
    name: 'password',
    nullable: true,
  })
  password: string;

  @Column({
    type: 'varchar',
    name: 'nickname',
    nullable: false,
  })
  @Index('idx_nickname', { unique: true })
  nickname: string;

  @Column({
    type: 'varchar',
    name: 'oauth_id',
    nullable: false,
  })
  @Index('idx_oauth_id', { unique: true })
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

  @OneToMany(() => GameUserEntity, (gameUser) => gameUser.user)
  gameUsers: Array<GameUserEntity>;

  private constructor(
    email: string,
    nickname: string,
    password: string,
    oAuthId: string,
    score: number,
    createdAt: Date,
  ) {
    super();
    this.email = email;
    this.nickname = nickname;
    this.password = password;
    this.oAuthId = oAuthId;
    this.score = score;
    this.createdAt = createdAt;
  }


  static createUser(email: string, nickname: string, oAuthId: string): UserEntity {
    return new UserEntity(email, nickname, null, oAuthId, 0, new Date());
  }

  static createAdmin(email: string, password: string, nickname: string, oAuthId: string): UserEntity {
    return new UserEntity(email, nickname, password, oAuthId, 0, new Date());
  }

  async verifyPassword(password: string) {
    if (!await bcrypt.compare(password, this.password)) {
      throw new NotFoundUserException();
    }
  }
}

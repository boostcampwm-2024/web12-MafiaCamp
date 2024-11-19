import { UserEntity } from '../entity/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository<T, TID> {
  save(t: T): Promise<void>;

  findById(tid: TID): Promise<T>;

  findByOAuthId(oauthId:string):Promise<UserEntity>;

  findByNickname(nickname: string): Promise<UserEntity>;

  updateNickname(nickname: string, userId: number): Promise<void>;
}

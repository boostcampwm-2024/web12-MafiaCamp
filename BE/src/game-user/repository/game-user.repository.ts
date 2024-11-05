export const GAME_USER_REPOSITORY = Symbol('GAME_USER_REPOSITORY');

export interface GameUserRepository<T, FIRST_ID, SECOND_ID> {
  save(t:T):Promise<T>;

  findByUserId(id: FIRST_ID): Promise<T>;

  findByGameId(id: SECOND_ID): Promise<T>;

}
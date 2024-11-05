export const GAME_HISTORY_REPOSITORY = Symbol('GAME_HISTORY_REPOSITORY');

export interface GameHistoryRepository<T, TID> {
  save(t:T):Promise<T>;

  findById(id: TID): Promise<T>;

}
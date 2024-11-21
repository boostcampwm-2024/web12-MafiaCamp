export const GAME_HISTORY_REPOSITORY = Symbol('GAME_HISTORY_REPOSITORY');

export interface GameHistoryRepository<T, TID> {
  save(t: T): Promise<void>;

  findById(id: TID): Promise<T>;

  saveGameResult(id: TID, history: Partial<T>): Promise<void>;
}

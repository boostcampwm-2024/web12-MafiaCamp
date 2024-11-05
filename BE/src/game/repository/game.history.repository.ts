export interface GameHistoryRepository<T, TID> {
  save(t:T):Promise<T>;

  findById(id: TID): Promise<T>;

}
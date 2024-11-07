export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository<T, TID> {
  save(t: T): Promise<void>;

  findById(tid: TID): Promise<T>;
}

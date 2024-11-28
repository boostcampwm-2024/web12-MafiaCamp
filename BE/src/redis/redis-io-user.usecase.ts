export const REDIS_IO_USER_USECASE = Symbol.for('REDIS_IO_USER_USECASE');

export interface RedisIOUserUseCase {
  setHash(hashName: string, userId: string, value: string): Promise<void>;

  delHash(hashName: string, userId: string): Promise<void>;

  getAllHash(hashName: string): Promise<Record<string, string>>;
}

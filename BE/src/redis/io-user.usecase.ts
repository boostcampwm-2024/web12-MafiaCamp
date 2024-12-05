export const IO_USER_USECASE = Symbol.for('IO_USER_USECASE');

export interface IOUserUseCase {
  setHash(hashName: string, userId: string, value: string): Promise<void>;

  delHash(hashName: string, userId: string): Promise<void>;

  getAllHash(hashName: string): Promise<Record<string, string>>;
}

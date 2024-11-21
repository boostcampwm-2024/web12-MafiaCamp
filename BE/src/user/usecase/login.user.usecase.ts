export const LOGIN_USER_USECASE = Symbol('LOGIN_USER_USECASE');

export interface LoginUserUsecase {
  login(code: string): Promise<Record<string, any>>;
}
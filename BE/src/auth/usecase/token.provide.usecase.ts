export const TOKEN_PROVIDE_USECASE = Symbol('TOKEN_PROVIDE_USECASE');

export interface TokenProvideUsecase {
  generateToken(payload: Record<string, any>): string;
}
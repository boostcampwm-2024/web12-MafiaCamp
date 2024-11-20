export const TOKEN_VERIFY_USECASE = Symbol('TOKEN_VERIFY_USECASE');

export interface TokenVerifyUsecase {
  verify(token: string): Record<string, any>;
}
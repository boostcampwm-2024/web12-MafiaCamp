export const FIND_USERINFO_USECASE = Symbol('FIND_USERINFO_USECASE');

export interface FindUserInfoUsecase {
  find(token: string): Promise<Record<string, any>>;
}
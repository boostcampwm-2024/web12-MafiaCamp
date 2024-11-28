export const FIND_USERINFO_USECASE = Symbol('FIND_USERINFO_USECASE');

export interface FindUserInfoUsecase {
  findHttp(token: string): Promise<Record<string, any>>;

  findWs(token: string): Promise<Record<string, any>>;
}
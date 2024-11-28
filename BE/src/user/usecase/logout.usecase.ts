import { LogoutRequest } from '../dto/logout.request';

export const LOGOUT_USECASE = Symbol('LOGOUT_USECASE');

export interface LogoutUsecase {
  logout(logoutRequest: LogoutRequest): void;
}
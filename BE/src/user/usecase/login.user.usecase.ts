import { RegisterUserResponse } from '../dto/register-user.response';

export const LOGIN_USER_USECASE = Symbol('LOGIN_USER_USECASE');

export interface LoginUserUsecase {
  login(code: string): Promise<RegisterUserResponse>;
}
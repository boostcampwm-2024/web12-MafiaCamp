import { RegisterUserRequest } from '../dto/register-user.request';
import { UserEntity } from '../entity/user.entity';

export const REGISTER_USER_USECASE = Symbol('REGISTER_USER_USECASE');

export interface RegisterUserUsecase {
  register(registerUserRequest: RegisterUserRequest): Promise<UserEntity>;
}

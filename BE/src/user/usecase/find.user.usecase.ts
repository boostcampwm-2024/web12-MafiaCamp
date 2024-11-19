import { UserEntity } from '../entity/user.entity';
import { FindUserRequest } from '../dto/find-user.request';

export const FIND_USER_USECASE = Symbol('FIND_USER_USECASE');

export interface FindUserUsecase {
  findById(findUserRequest: FindUserRequest): Promise<UserEntity>;
}

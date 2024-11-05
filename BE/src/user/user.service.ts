import { FindUserUsecase } from './usecase/find.user.usecase';
import { RegisterUserUsecase } from './usecase/register.user.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { FindUserRequest } from './dto/find-user.request';
import { UserEntity } from './entity/user.entity';
import { RegisterUserRequest } from './dto/register-user.request';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService implements FindUserUsecase, RegisterUserUsecase {

  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository<UserEntity, number>) {
  }

  async findById(findUserRequest: FindUserRequest): Promise<UserEntity> {
    return await this.userRepository.findById(findUserRequest.userId);
  }

  async register(registerUserRequest: RegisterUserRequest): Promise<UserEntity> {
    const userEntity = UserEntity.create(registerUserRequest.email, registerUserRequest.nickname, registerUserRequest.oAuthId);
    await this.userRepository.save(userEntity);
    return userEntity;
  }
}
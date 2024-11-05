import { UserRepository } from './user.repository';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { NotFoundUserError } from '../../common/error/not.found.user.error';
import { errorMessage } from '../../common/error/error.message';
import { errorCode } from '../../common/error/error.code';

export class TypeormUserRepository implements UserRepository<UserEntity, number> {

  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<UserEntity>) {
  }

  async save(userEntity: UserEntity): Promise<void> {
    await this.userRepository.save(userEntity);
  }

  async findById(userId: number): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOneBy({
      userId: userId,
    });
    if (userEntity) {
      return userEntity;
    }
    throw new NotFoundUserError(errorMessage.NOT_FOUND_USER_ERROR, errorCode.NOT_FOUND_USER_ERROR);
  }

}
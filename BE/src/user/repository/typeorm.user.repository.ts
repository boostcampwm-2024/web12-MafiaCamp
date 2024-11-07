import { UserRepository } from './user.repository';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { NotFoundUserException } from '../../common/error/not.found.user.exception';
import { InjectRepository } from '@nestjs/typeorm';

export class TypeormUserRepository implements UserRepository<UserEntity, number> {

  constructor(
    @InjectRepository(UserEntity)
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
    throw new NotFoundUserException();
  }

}
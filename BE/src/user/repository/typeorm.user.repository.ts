import { UserRepository } from './user.repository';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { NotFoundUserException } from '../../common/error/not.found.user.exception';
import { InjectRepository } from '@nestjs/typeorm';

export class TypeormUserRepository
  implements UserRepository<UserEntity, number> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _repository: Repository<UserEntity>,
  ) {
  }

  async save(userEntity: UserEntity): Promise<void> {
    await this._repository.insert(userEntity);
  }

  async findById(userId: number): Promise<UserEntity> {
    const userEntity = await this._repository.findOneBy({
      userId: userId,
    });
    if (userEntity) {
      return userEntity;
    }
    throw new NotFoundUserException();
  }

  async findByOAuthId(oauthId: string): Promise<UserEntity> {
    return await this._repository.findOneBy({
      oAuthId: oauthId,
    });
  }

  async findByNickname(nickname: string): Promise<UserEntity> {
    return await this._repository.findOneBy({
      nickname: nickname,
    });
  }

  async updateNickname(nickname: string, userId: number): Promise<void> {
    await this._repository.update({ userId }, { nickname });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this._repository.findOneBy({
      email: email,
    });
  }

}

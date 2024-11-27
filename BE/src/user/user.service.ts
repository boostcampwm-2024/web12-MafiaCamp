import { FindUserUsecase } from './usecase/find.user.usecase';
import { RegisterUserUsecase } from './usecase/register.user.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { FindUserRequest } from './dto/find-user.request';
import { UserEntity } from './entity/user.entity';
import { RegisterUserRequest } from './dto/register-user.request';
import { USER_REPOSITORY, UserRepository } from './repository/user.repository';
import { Transactional } from 'typeorm-transactional';
import { LoginUserUsecase } from './usecase/login.user.usecase';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { UpdateUserUsecase } from './usecase/update.user.usecase';
import { UpdateNicknameRequest } from './dto/update-nickname.request';
import { DuplicateNicknameException } from '../common/error/duplicate.nickname.exception';
import { RegisterUserResponse } from './dto/register-user.response';
import { TOKEN_PROVIDE_USECASE, TokenProvideUsecase } from '../auth/usecase/token.provide.usecase';
import { LoginAdminUsecase } from './usecase/login.admin.usecase';
import { AdminLoginRequest } from './dto/admin-login.request';
import { RegisterAdminUsecase } from './usecase/register.admin.usecase';
import { RegisterAdminRequest } from './dto/register-admin.request';
import * as bcrypt from 'bcrypt';
import { FindUserInfoUsecase } from './usecase/find.user-info.usecase';
import { TOKEN_VERIFY_USECASE, TokenVerifyUsecase } from '../auth/usecase/token.verify.usecase';
import { NotFoundUserException } from '../common/error/not.found.user.exception';

@Injectable()
export class UserService implements FindUserUsecase, RegisterUserUsecase, LoginUserUsecase, UpdateUserUsecase, LoginAdminUsecase, RegisterAdminUsecase, FindUserInfoUsecase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository<UserEntity, number>,
    @Inject(TOKEN_PROVIDE_USECASE)
    private readonly tokenProvideUsecase: TokenProvideUsecase,
    @Inject(TOKEN_VERIFY_USECASE)
    private readonly tokenVerifyUsecase: TokenVerifyUsecase,
    private readonly configService: ConfigService,
  ) {
  }

  async findById(findUserRequest: FindUserRequest): Promise<UserEntity> {
    return await this.userRepository.findById(findUserRequest.userId);
  }

  @Transactional()
  async register(
    registerUserRequest: RegisterUserRequest,
  ): Promise<UserEntity> {
    const userEntity = UserEntity.createUser(
      registerUserRequest.email,
      registerUserRequest.nickname,
      registerUserRequest.oAuthId,
    );
    await this.userRepository.save(userEntity);
    return userEntity;
  }

  async login(code: string): Promise<Record<string, any>> {
    const clientId = this.configService.get<string>('CLIENT_ID');
    const redirectUrl = this.configService.get<string>('REDIRECT_URL');
    const response = await axios.post('https://kauth.kakao.com/oauth/token', new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUrl,
        code: code,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const userInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
      },
    });
    const nickname = uuid();
    const userEntity = await this.userRepository.findByOAuthId(userInfo.data.id);
    if (!userEntity) {
      const newUserEntity = await this.register(new RegisterUserRequest(userInfo.data.kakao_account.email, nickname, userInfo.data.id));
      const accessToken = this.tokenProvideUsecase.provide({
        userId: newUserEntity.userId,
      });
      return {
        token: accessToken,
        response: new RegisterUserResponse(nickname, newUserEntity.userId),
      };
    }
    const accessToken = this.tokenProvideUsecase.provide({
      userId: userEntity.userId,
    });
    return {
      token: accessToken,
      response: new RegisterUserResponse(userEntity.nickname, userEntity.userId),
    };
  }

  @Transactional()
  async updateNickname(updateNicknameRequest: UpdateNicknameRequest) {
    const userEntity = await this.userRepository.findByNickname(updateNicknameRequest.nickname);
    if (userEntity) {
      throw new DuplicateNicknameException();
    }
    await this.userRepository.updateNickname(updateNicknameRequest.nickname, updateNicknameRequest.userId);
  }

  async loginAdmin(adminLoginRequest: AdminLoginRequest): Promise<Record<string, any>> {
    const userEntity = await this.userRepository.findByEmail(adminLoginRequest.email);
    await userEntity.verifyPassword(adminLoginRequest.password);
    const accessToken = this.tokenProvideUsecase.provide({
      userId: userEntity.userId,
    });
    return {
      token: accessToken,
      response: new RegisterUserResponse(userEntity.nickname, userEntity.userId),
    };
  }

  async registerAdmin(registerAdminRequest: RegisterAdminRequest): Promise<void> {
    const hashPassword = await bcrypt.hash(registerAdminRequest.password, 10);
    const userEntity = UserEntity.createAdmin(registerAdminRequest.email, hashPassword, registerAdminRequest.nickname, registerAdminRequest.oAuthId);
    await this.userRepository.save(userEntity);
  }

  async find(token: string): Promise<Record<string, any>> {
    const payload = this.tokenVerifyUsecase.verify(token);
    const userId = +payload.userId;
    const userEntity = await this.userRepository.findById(userId);
    if (!userEntity) {
      throw new NotFoundUserException();
    }
    return {
      nickname: userEntity.nickname,
      userId: userId,
    };
  }
}

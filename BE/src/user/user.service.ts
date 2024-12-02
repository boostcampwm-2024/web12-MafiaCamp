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
import {
  TOKEN_PROVIDE_USECASE,
  TokenProvideUsecase,
} from '../auth/usecase/token.provide.usecase';
import { LoginAdminUsecase } from './usecase/login.admin.usecase';
import { AdminLoginRequest } from './dto/admin-login.request';
import { RegisterAdminUsecase } from './usecase/register.admin.usecase';
import { RegisterAdminRequest } from './dto/register-admin.request';
import * as bcrypt from 'bcrypt';
import { FindUserInfoUsecase } from './usecase/find.user-info.usecase';
import {
  TOKEN_VERIFY_USECASE,
  TokenVerifyUsecase,
} from '../auth/usecase/token.verify.usecase';
import { NotFoundUserException } from '../common/error/not.found.user.exception';
import { CONNECTED_USER_USECASE } from '../online-state/connected-user.usecase';
import { ConnectedUserService } from '../online-state/connected-user.service';
import { DuplicateLoginUserException } from '../common/error/duplicate.login-user.exception';
import { LogoutUsecase } from './usecase/logout.usecase';
import { LogoutRequest } from './dto/logout.request';
import { EventClientManager } from '../event/event-client-manager';

@Injectable()
export class UserService
  implements
    FindUserUsecase,
    RegisterUserUsecase,
    LoginUserUsecase,
    UpdateUserUsecase,
    LoginAdminUsecase,
    RegisterAdminUsecase,
    FindUserInfoUsecase,
    LogoutUsecase
{
  private readonly loginBox = new Map<number, string>();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository<UserEntity, number>,
    @Inject(TOKEN_PROVIDE_USECASE)
    private readonly tokenProvideUsecase: TokenProvideUsecase,
    @Inject(TOKEN_VERIFY_USECASE)
    private readonly tokenVerifyUsecase: TokenVerifyUsecase,
    private readonly configService: ConfigService,
    private readonly eventClientManager: EventClientManager,
    @Inject(CONNECTED_USER_USECASE)
    private readonly connectedUserService: ConnectedUserService,
  ) {}

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
    const response = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      new URLSearchParams({
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
    const userEntity = await this.userRepository.findByOAuthId(
      userInfo.data.id,
    );
    if (!userEntity) {
      const newUserEntity = await this.register(
        new RegisterUserRequest(
          userInfo.data.kakao_account.email,
          nickname,
          userInfo.data.id,
        ),
      );
      this.loginBox.set(+newUserEntity.userId, newUserEntity.nickname);
      const accessToken = this.tokenProvideUsecase.provide({
        userId: +newUserEntity.userId,
      });
      return {
        token: accessToken,
        response: new RegisterUserResponse(nickname, +newUserEntity.userId),
      };
    }
    if (this.loginBox.has(+userEntity.userId)) {
      throw new DuplicateLoginUserException();
    }
    this.loginBox.set(+userEntity.userId, userEntity.nickname);
    const accessToken = this.tokenProvideUsecase.provide({
      userId: +userEntity.userId,
    });
    return {
      token: accessToken,
      response: new RegisterUserResponse(
        userEntity.nickname,
        +userEntity.userId,
      ),
    };
  }

  @Transactional()
  async updateNickname(updateNicknameRequest: UpdateNicknameRequest) {
    const userEntity = await this.userRepository.findByNickname(
      updateNicknameRequest.nickname,
    );

    if (userEntity) {
      throw new DuplicateNicknameException();
    }

    this.loginBox.set(
      +updateNicknameRequest.userId,
      updateNicknameRequest.nickname,
    );

    await this.userRepository.updateNickname(
      updateNicknameRequest.nickname,
      updateNicknameRequest.userId,
    );

    this.eventClientManager.updateNickName(
      updateNicknameRequest.userId,
      updateNicknameRequest.nickname,
    );

    await this.connectedUserService.enter({
      userId: String(updateNicknameRequest.userId),
      nickname: updateNicknameRequest.nickname,
    });
  }

  async loginAdmin(
    adminLoginRequest: AdminLoginRequest,
  ): Promise<Record<string, any>> {
    const userEntity = await this.userRepository.findByEmail(
      adminLoginRequest.email,
    );
    await userEntity.verifyPassword(adminLoginRequest.password);
    if (this.loginBox.has(+userEntity.userId)) {
      throw new DuplicateLoginUserException();
    }
    this.loginBox.set(+userEntity.userId, userEntity.nickname);
    const accessToken = this.tokenProvideUsecase.provide({
      userId: userEntity.userId,
    });
    return {
      token: accessToken,
      response: new RegisterUserResponse(
        userEntity.nickname,
        userEntity.userId,
      ),
    };
  }

  async registerAdmin(
    registerAdminRequest: RegisterAdminRequest,
  ): Promise<void> {
    const hashPassword = await bcrypt.hash(registerAdminRequest.password, 10);
    const userEntity = UserEntity.createAdmin(
      registerAdminRequest.email,
      hashPassword,
      registerAdminRequest.nickname,
      registerAdminRequest.oAuthId,
    );
    await this.userRepository.save(userEntity);
  }

  logout(logoutRequest: LogoutRequest): void {
    const userId = logoutRequest.userId;
    this.loginBox.delete(userId);
  }

  async findHttp(token: string): Promise<Record<string, any>> {
    const payload = this.tokenVerifyUsecase.verify(token);
    const userId = +payload.userId;
    const userEntity = await this.userRepository.findById(userId);
    if (!userEntity) {
      throw new NotFoundUserException();
    }
    if (this.loginBox.has(userId)) {
      return {
        nickname: null,
        userId: userId,
      };
    }
    this.loginBox.set(+userId, userEntity.nickname);
    return {
      nickname: userEntity.nickname,
      userId: userId,
    };
  }

  async findWs(token: string): Promise<Record<string, any>> {
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

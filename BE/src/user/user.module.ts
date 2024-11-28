import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './repository/user.repository';
import { TypeormUserRepository } from './repository/typeorm.user.repository';
import { FIND_USER_USECASE } from './usecase/find.user.usecase';
import { UserService } from './user.service';
import { REGISTER_USER_USECASE } from './usecase/register.user.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { AuthController } from './controller/auth.controller';
import { LOGIN_USER_USECASE } from './usecase/login.user.usecase';
import { UPDATE_USER_USECASE } from './usecase/update.user.usecase';
import { UserController } from './controller/user.controller';
import { AuthModule } from '../auth/auth.module';
import { REGISTER_ADMIN_USECASE } from './usecase/register.admin.usecase';
import { LOGIN_ADMIN_USECASE } from './usecase/login.admin.usecase';
import { FIND_USERINFO_USECASE } from './usecase/find.user-info.usecase';
import { LOGOUT_USECASE } from './usecase/logout.usecase';

@Module({
  controllers: [AuthController, UserController],
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: TypeormUserRepository,
    },
    {
      provide: FIND_USER_USECASE,
      useExisting: UserService,
    },
    {
      provide: REGISTER_USER_USECASE,
      useExisting: UserService,
    },
    {
      provide: LOGIN_USER_USECASE,
      useExisting: UserService,
    },
    {
      provide: UPDATE_USER_USECASE,
      useExisting: UserService,
    },
    {
      provide: REGISTER_ADMIN_USECASE,
      useExisting: UserService,
    },
    {
      provide: LOGIN_ADMIN_USECASE,
      useExisting: UserService,
    },
    {
      provide: FIND_USERINFO_USECASE,
      useExisting: UserService,
    },
    {
      provide: LOGOUT_USECASE,
      useExisting: UserService,
    },
  ],
  exports: [FIND_USER_USECASE, REGISTER_USER_USECASE, FIND_USERINFO_USECASE, LOGOUT_USECASE],
})
export class UserModule {
}

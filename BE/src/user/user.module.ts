import { forwardRef, Module } from '@nestjs/common';
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
import { EventModule } from '../event/event.module';
import { OnlineStateModule } from '../online-state/online-state.module';

@Module({
  controllers: [AuthController, UserController],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    forwardRef(() => EventModule),
    OnlineStateModule,
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: TypeormUserRepository,
    },
    {
      provide: FIND_USER_USECASE,
      useClass: UserService,
    },
    {
      provide: REGISTER_USER_USECASE,
      useClass: UserService,
    },
    {
      provide: LOGIN_USER_USECASE,
      useClass: UserService,
    },
    {
      provide: UPDATE_USER_USECASE,
      useClass: UserService,
    },
    {
      provide: REGISTER_ADMIN_USECASE,
      useClass: UserService,
    },
    {
      provide: LOGIN_ADMIN_USECASE,
      useClass: UserService,
    },
    {
      provide: FIND_USERINFO_USECASE,
      useClass: UserService,
    },
  ],
  exports: [FIND_USER_USECASE, REGISTER_USER_USECASE, FIND_USERINFO_USECASE],
})
export class UserModule {}

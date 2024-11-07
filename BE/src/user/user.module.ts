import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './repository/user.repository';
import { TypeormUserRepository } from './repository/typeorm.user.repository';
import { FIND_USER_USECASE } from './usecase/find.user.usecase';
import { UserService } from './user.service';
import { REGISTER_USER_USECASE } from './usecase/register.user.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity])
  ]
  , providers:[
    {
      provide:USER_REPOSITORY,
      useClass:TypeormUserRepository
    },
    {
      provide:FIND_USER_USECASE,
      useClass:UserService
    },
    {
      provide:REGISTER_USER_USECASE,
      useClass:UserService
    }
  ],
  exports:[FIND_USER_USECASE,REGISTER_USER_USECASE]
})
export class UserModule {

}
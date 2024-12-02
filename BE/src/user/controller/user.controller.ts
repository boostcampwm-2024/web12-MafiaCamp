import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UpdateNicknameRequest } from '../dto/update-nickname.request';
import { UPDATE_USER_USECASE, UpdateUserUsecase } from '../usecase/update.user.usecase';
import { UserDetailJwtGuard } from '../../auth/guard/user-detail.jwt.guard';
import { RegisterAdminRequest } from '../dto/register-admin.request';
import { REGISTER_ADMIN_USECASE, RegisterAdminUsecase } from '../usecase/register.admin.usecase';
import { FIND_USERINFO_USECASE, FindUserInfoUsecase } from '../usecase/find.user-info.usecase';
import { Request } from 'express';

@Controller('')
export class UserController {

  constructor(@Inject(UPDATE_USER_USECASE)
              private readonly updateUserUsecase: UpdateUserUsecase,
              @Inject(REGISTER_ADMIN_USECASE)
              private readonly registerAdminUsecase: RegisterAdminUsecase,
              @Inject(FIND_USERINFO_USECASE)
              private readonly findUserInfoUsecase: FindUserInfoUsecase) {
  }

  @HttpCode(HttpStatus.OK)
  @Patch('user/nickname')
  @UseGuards(UserDetailJwtGuard)
  async updateNickname(@Body() updateNicknameRequest: UpdateNicknameRequest) {
    await this.updateUserUsecase.updateNickname(updateNicknameRequest);
  }

  @HttpCode(HttpStatus.OK)
  @Post('admin/register')
  async registerAdmin(@Body() registerAdminRequest: RegisterAdminRequest) {
    await this.registerAdminUsecase.registerAdmin(registerAdminRequest);
  }

  @HttpCode(HttpStatus.OK)
  @Get('user/info')
  async getInfo(@Req() request: Request) {
    const [_, token] = request.headers?.authorization.split(' ');
    return await this.findUserInfoUsecase.findHttp(token);
  }
}
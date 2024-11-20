import { Body, Controller, HttpCode, HttpStatus, Inject, Patch, Post, UseGuards } from '@nestjs/common';
import { UpdateNicknameRequest } from '../dto/update-nickname.request';
import { UPDATE_USER_USECASE, UpdateUserUsecase } from '../usecase/update.user.usecase';
import { UserDetailJwtGuard } from '../../auth/guard/user-detail.jwt.guard';
import { RegisterAdminRequest } from '../dto/register-admin.request';
import { REGISTER_ADMIN_USECASE, RegisterAdminUsecase } from '../usecase/register.admin.usecase';

@Controller('api')
export class UserController {

  constructor(@Inject(UPDATE_USER_USECASE)
              private readonly updateUserUsecase: UpdateUserUsecase,
              @Inject(REGISTER_ADMIN_USECASE)
              private readonly registerAdminUseCase: RegisterAdminUsecase) {
  }

  @Patch('user/nickname')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserDetailJwtGuard)
  async updateNickname(@Body() updateNicknameRequest: UpdateNicknameRequest) {
    await this.updateUserUsecase.updateNickname(updateNicknameRequest);
    return;
  }

  @Post('admin/register')
  @HttpCode(HttpStatus.OK)
  async registerAdmin(@Body() registerAdminRequest: RegisterAdminRequest) {
    await this.registerAdminUseCase.registerAdmin(registerAdminRequest);
    return;
  }
}
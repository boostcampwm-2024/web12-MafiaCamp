import { Body, Controller, HttpCode, HttpStatus, Inject, Patch, UseGuards } from '@nestjs/common';
import { UpdateNicknameRequest } from '../dto/update-nickname.request';
import { UPDATE_USER_USECASE, UpdateUserUsecase } from '../usecase/update.user.usecase';
import { UserDetailJwtGuard } from '../../auth/guard/user-detail.jwt.guard';

@Controller('api/user')
export class UserController {

  constructor(@Inject(UPDATE_USER_USECASE)
              private readonly updateUserUsecase: UpdateUserUsecase) {
  }

  @Patch('nickname')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserDetailJwtGuard)
  async updateNickname(@Body() updateNicknameRequest: UpdateNicknameRequest) {
    await this.updateUserUsecase.updateNickname(updateNicknameRequest);
    return;
  }
}
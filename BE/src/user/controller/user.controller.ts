import { Body, Controller, HttpCode, HttpStatus, Inject, Patch } from '@nestjs/common';
import { UpdateNicknameRequest } from '../dto/update-nickname.request';
import { UPDATE_USER_USECASE, UpdateUserUsecase } from '../usecase/update.user.usecase';

@Controller('user')
export class UserController {

  constructor(@Inject(UPDATE_USER_USECASE)
              private readonly updateUserUsecase: UpdateUserUsecase) {
  }

  @Patch('nickname')
  @HttpCode(HttpStatus.OK)
  async updateNickname(@Body() updateNicknameRequest: UpdateNicknameRequest) {
    await this.updateUserUsecase.updateNickname(updateNicknameRequest);
    return;
  }
}
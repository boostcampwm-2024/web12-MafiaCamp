import { UpdateNicknameRequest } from '../dto/update-nickname.request';

export const UPDATE_USER_USECASE = Symbol('UPDATE_USER_USECASE');

export interface UpdateUserUsecase {
  updateNickname(updateNicknameRequest: UpdateNicknameRequest): Promise<void>;
}
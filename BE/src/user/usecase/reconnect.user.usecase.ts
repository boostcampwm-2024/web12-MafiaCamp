import { ReconnectUserRequest } from '../dto/reconnect.user.request';

export const RECONNECT_USER_USECASE = Symbol('RECONNECT_USER_USECASE');

export interface ReconnectUserUsecase {
  reconnect(reconnectUserRequest: ReconnectUserRequest);
}
import { RegisterAdminRequest } from '../dto/register-admin.request';

export const REGISTER_ADMIN_USECASE = Symbol('REGISTER_ADMIN_USECASE');

export interface RegisterAdminUsecase {
  registerAdmin(registerAdminRequest: RegisterAdminRequest): Promise<void>;
}
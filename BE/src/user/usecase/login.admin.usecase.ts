import { AdminLoginRequest } from '../dto/admin-login.request';

export const LOGIN_ADMIN_USECASE = Symbol('LOGIN_ADMIN_USECASE');

export interface LoginAdminUsecase {
  loginAdmin(adminLoginRequest: AdminLoginRequest): Promise<Record<string, any>>;
}
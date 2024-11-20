import { TokenProvideUsecase } from './usecase/token.provide.usecase';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenVerifyUsecase } from './usecase/token.verify.usecase';
import { UnauthorizedUserException } from '../common/error/unauthorized.user.exception';

@Injectable()
export class AuthService implements TokenProvideUsecase, TokenVerifyUsecase {

  constructor(private readonly jwtService: JwtService) {
  }

  provide(payload: Record<string, string>): string {
    return this.jwtService.sign(payload);
  }

  verify(token: string): Record<string, any> {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedUserException();
    }
  }

}
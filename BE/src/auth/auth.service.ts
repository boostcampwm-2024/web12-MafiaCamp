import { TokenProvideUsecase } from './usecase/token.provide.usecase';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements TokenProvideUsecase {

  constructor(private readonly jwtService: JwtService) {
  }

  generateToken(payload: Record<string, string>): string {
    return this.jwtService.sign(payload);
  }

}
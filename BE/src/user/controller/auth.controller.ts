import { Controller, Get, Inject, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { LOGIN_USER_USECASE, LoginUserUsecase } from '../usecase/login.user.usecase';

@Controller('api/login')
export class AuthController {

  constructor(private readonly configService: ConfigService,
              @Inject(LOGIN_USER_USECASE)
              private readonly loginUserUsecase: LoginUserUsecase) {
  }

  @Get('kakao')
  kakaoLogin(@Res({ passthrough: true }) res: Response) {
    const clientId = this.configService.get<string>('CLIENT_ID');
    const redirectUrl = this.configService.get<string>('REDIRECT_URL');
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code`;

    res.redirect(kakaoAuthUrl);
    return;
  }

  @Get('kakao/callback')
  async kakaoCallback(@Query('code') code: string) {
    return await this.loginUserUsecase.login(code);
  }
}
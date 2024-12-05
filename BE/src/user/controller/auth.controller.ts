import { Body, Controller, Get, Inject, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { LOGIN_USER_USECASE, LoginUserUsecase } from '../usecase/login.user.usecase';
import { AdminLoginRequest } from '../dto/admin-login.request';
import { LOGIN_ADMIN_USECASE, LoginAdminUsecase } from '../usecase/login.admin.usecase';
import { LogoutRequest } from '../dto/logout.request';
import { UserDetailJwtGuard } from '../../auth/guard/user-detail.jwt.guard';
import { LOGOUT_USECASE, LogoutUsecase } from '../usecase/logout.usecase';

@Controller('')
export class AuthController {

  constructor(private readonly configService: ConfigService,
              @Inject(LOGIN_USER_USECASE)
              private readonly loginUserUsecase: LoginUserUsecase,
              @Inject(LOGIN_ADMIN_USECASE)
              private readonly loginAdminUsecase: LoginAdminUsecase,
              @Inject(LOGOUT_USECASE)
              private readonly logoutUsecase: LogoutUsecase) {
  }

  @Post('login/admin')
  async adminLogin(@Body() adminLoginRequest: AdminLoginRequest, @Res({ passthrough: true }) res: Response) {
    const { token, response } = await this.loginAdminUsecase.loginAdmin(adminLoginRequest);
    res.setHeader('X-ACCESS-TOKEN', token);
    return response;
  }

  @Get('login/kakao')
  kakaoLogin(@Res({ passthrough: true }) res: Response) {
    const clientId = this.configService.get<string>('CLIENT_ID');
    const redirectUrl = this.configService.get<string>('REDIRECT_URL');
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code`;

    res.redirect(kakaoAuthUrl);
  }

  @Get('login/kakao/callback')
  async kakaoCallback(@Query('code') code: string, @Res({ passthrough: true }) res: Response) {
    const { token, response } = await this.loginUserUsecase.login(code);
    res.setHeader('X-ACCESS-TOKEN', token);
    return response;
  }

  @Post('/logout')
  @UseGuards(UserDetailJwtGuard)
  logout(@Body() logoutRequest: LogoutRequest) {
    this.logoutUsecase.logout(logoutRequest);
  }
}
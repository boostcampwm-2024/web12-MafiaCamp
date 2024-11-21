import { IsEmail, IsString } from 'class-validator';

export class RegisterUserRequest {
  @IsEmail()
  email: string;
  @IsString()
  nickname: string;
  @IsString()
  oAuthId: string;


  constructor(email: string, nickname: string, oAuthId: string) {
    this.email = email;
    this.nickname = nickname;
    this.oAuthId = oAuthId;
  }
}

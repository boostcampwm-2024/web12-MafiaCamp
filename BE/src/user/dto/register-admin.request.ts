import { IsEmail, IsString } from 'class-validator';

export class RegisterAdminRequest {
  @IsEmail()
  email: string;
  @IsString()
  nickname: string;
  @IsString()
  password:string;
  @IsString()
  oAuthId: string;
}

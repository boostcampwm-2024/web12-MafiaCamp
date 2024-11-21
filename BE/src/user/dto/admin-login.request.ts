import { IsEmail, IsString } from 'class-validator';

export class AdminLoginRequest {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
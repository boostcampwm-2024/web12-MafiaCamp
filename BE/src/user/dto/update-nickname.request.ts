import { IsString, Length } from 'class-validator';

export class UpdateNicknameRequest {
  @IsString()
  @Length(1, 50)
  nickname: string;

  userId: number;
}
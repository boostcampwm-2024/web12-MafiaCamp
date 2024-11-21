export class RegisterUserResponse {
  nickname: string;
  userId: number;

  constructor(nickname: string, userId: number) {
    this.nickname = nickname;
    this.userId = userId;
  }
}
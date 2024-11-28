export class ReconnectUserRequest {
  userId: number;
  nickname: string;

  constructor(userId: number, nickname: string) {
    this.userId = userId;
    this.nickname = nickname;
  }
}
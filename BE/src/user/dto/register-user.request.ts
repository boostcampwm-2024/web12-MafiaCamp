export class RegisterUserRequest {
  email: string;
  nickname: string;
  oAuthId: string;


  constructor(email: string, nickname: string, oAuthId: string) {
    this.email = email;
    this.nickname = nickname;
    this.oAuthId = oAuthId;
  }
}

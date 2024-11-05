export class FindUserRequest {

  private readonly _userId: number;
  constructor(userId: number) {
    this._userId = userId;
  }


  get userId(): number {
    return this._userId;
  }
}
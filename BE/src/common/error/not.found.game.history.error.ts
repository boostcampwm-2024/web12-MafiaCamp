export class NotFoundGameHistoryError extends Error {
  code;
  name;
  constructor(message: string, code:number) {
    super(message);
    this.code = code;
    this.name = 'NotFoundGameHistoryError'
  }
}
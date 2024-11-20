import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';

export class UnauthorizedMafiaSelectException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.UNAUTHORIZED_MAFIA_SELECT_EXCEPTION,
        message: EXCEPTION_MESSAGE.UNAUTHORIZED_MAFIA_SELECT_EXCEPTION,
        error: 'UnauthorizedMafiaSelectException',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

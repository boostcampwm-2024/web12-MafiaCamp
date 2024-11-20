import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';

export class UnauthorizedSelectException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.UNAUTHORIZED_USER_SELECT_EXCEPTION,
        message: EXCEPTION_MESSAGE.UNAUTHORIZED_USER_SELECT_EXCEPTION,
        error: 'UnauthorizedUserSelectException',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

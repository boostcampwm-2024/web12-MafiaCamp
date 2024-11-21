import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';

export class UnauthorizedUserException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.UNAUTHORIZED_USER_EXCEPTION,
        message: EXCEPTION_MESSAGE.UNAUTHORIZED_USER_EXCEPTION,
        error: 'UnauthorizedUserException',
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
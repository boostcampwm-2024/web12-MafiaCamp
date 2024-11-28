import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';

export class DuplicateLoginUserException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.DUPLICATE_LOGIN_USER_EXCEPTION,
        message: EXCEPTION_MESSAGE.DUPLICATE_LOGIN_USER_EXCEPTION,
        error: 'DuplicateLoginUserException',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
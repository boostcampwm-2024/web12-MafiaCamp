import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';

export class InvalidPasswordException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.INVALID_PASSWORD_EXCEPTION,
        message: EXCEPTION_MESSAGE.INVALID_PASSWORD_EXCEPTION,
        error: 'InvalidPasswordException',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
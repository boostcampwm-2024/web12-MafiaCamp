import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';

export class CanNotSelectUserException extends HttpException {
  constructor(reason?: string) {
    super(
      {
        code: EXCEPTION_CODE.CANNOT_SELECT_USER_EXCEPTION,
        message: reason || EXCEPTION_MESSAGE.CANNOT_SELECT_USER_EXCEPTION,
        error: 'CanNotSelectUserException',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

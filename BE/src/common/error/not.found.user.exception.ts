import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';
import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundUserException extends HttpException{
  constructor() {
    super({
        code: EXCEPTION_CODE.NOT_FOUND_USER_EXCEPTION,
        message: EXCEPTION_MESSAGE.NOT_FOUND_USER_EXCEPTION,
        error: 'NotFoundUserException',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST);
  }
}
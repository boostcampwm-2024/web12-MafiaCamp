import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';

export class DuplicateNicknameException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.DUPLICATE_NICKNAME_EXCEPTION,
        message: EXCEPTION_MESSAGE.DUPLICATE_NICKNAME_EXCEPTION,
        error: 'DuplicateNicknameException',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
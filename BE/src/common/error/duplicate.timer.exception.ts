import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';

export class DuplicateTimerException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.DUPLICATE_TIMER_EXCEPTION,
        message: EXCEPTION_MESSAGE.DUPLICATE_TIMER_EXCEPTION,
        error: 'DuplicateTimerException',
        statusCode: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
    );
  }
}

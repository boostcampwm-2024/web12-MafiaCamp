import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';

export class DuplicateGameContextException extends HttpException {
  constructor(reason?: string) {
    super(
      {
        code: EXCEPTION_CODE.DUPLICATE_GAME_CONTEXT_EXCEPTION,
        message: reason || EXCEPTION_MESSAGE.DUPLICATE_GAME_CONTEXT_EXCEPTION,
        error: 'DuplicateGameContextException',
        statusCode: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
    );
  }
}
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';
import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundGameHistoryException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.NOT_FOUND_GAME_HISTORY_EXCEPTION,
        message: EXCEPTION_MESSAGE.NOT_FOUND_GAME_HISTORY_EXCEPTION,
        error: 'NotFoundGameHistoryException',
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

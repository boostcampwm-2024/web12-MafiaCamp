import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';
import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundGameHistoryException extends HttpException {
  constructor() {
    super({
        code: EXCEPTION_CODE.NOT_FOUND_GAME_HISTORY_EXCEPTION,
        message: EXCEPTION_MESSAGE.GAME_INVALID_PLAYER_COUNT_EXCEPTION,
        error: 'NotFoundGameHistoryException',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST);
  }
}
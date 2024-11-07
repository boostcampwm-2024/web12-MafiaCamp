import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_MESSAGE } from './exception.message';
import { EXCEPTION_CODE } from './exception.code';

export class GameInvalidPlayerCountException extends HttpException {

  constructor() {
    super({
        code: EXCEPTION_CODE.GAME_INVALID_PLAYER_COUNT_EXCEPTION,
        message: EXCEPTION_MESSAGE.GAME_INVALID_PLAYER_COUNT_EXCEPTION,
        error: 'GameInvalidPlayerCountException',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST);
  }
}
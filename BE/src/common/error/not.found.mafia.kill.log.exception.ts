import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';

export class NotFoundMafiaKillLogException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.NOT_FOUND_MAFIA_KILL_LOG,
        message: EXCEPTION_MESSAGE.NOT_FOUND_MAFIA_KILL_LOG,
        error: 'NotFoundMafiaKillLogException',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

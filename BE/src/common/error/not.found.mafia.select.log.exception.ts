import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';

export class NotFoundMafiaSelectLogException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.NOT_FOUND_MAFIA_SELECT_LOG,
        message: EXCEPTION_MESSAGE.NOT_FOUND_MAFIA_SELECT_LOG,
        error: 'NotFoundMafiaSelectLogException',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

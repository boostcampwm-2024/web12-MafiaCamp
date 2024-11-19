import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';

export class CanNotSelectMafiaException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.CANNOT_SELECT_MAFIA_EXCEPTION,
        message: EXCEPTION_MESSAGE.CANNOT_SELECT_MAFIA_EXCEPTION,
        error: 'CanNotSelectMafiaException',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

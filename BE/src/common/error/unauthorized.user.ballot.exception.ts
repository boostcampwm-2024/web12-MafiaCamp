import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';

export class UnauthorizedUserBallotException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.UNAUTHORIZED_USER_BALLOT_EXCEPTION,
        message: EXCEPTION_MESSAGE.UNAUTHORIZED_USER_BALLOT_EXCEPTION,
        error: 'UnauthorizedUserBallotException',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

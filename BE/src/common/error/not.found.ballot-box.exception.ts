import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';

export class NotFoundBallotBoxException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.NOT_FOUND_BALLOT_BOX_EXCEPTION,
        message: EXCEPTION_MESSAGE.NOT_FOUND_BALLOT_BOX_EXCEPTION,
        error: 'NotFoundBallotBoxException',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
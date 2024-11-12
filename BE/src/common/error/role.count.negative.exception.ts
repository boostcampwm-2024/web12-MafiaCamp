import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';
import { HttpException, HttpStatus } from '@nestjs/common';

export class RoleCountNegativeException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.ROLE_COUNT_NEGATIVE_EXCEPTION,
        message: EXCEPTION_MESSAGE.ROLE_COUNT_NEGATIVE_EXCEPTION,
        error: 'RoleCountNegativeException',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

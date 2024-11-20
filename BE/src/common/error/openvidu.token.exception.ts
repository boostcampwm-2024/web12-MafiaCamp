import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';

export class OpenViduTokenGenerationFailedException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.FAILED_TO_GENERATE_OPENVIDU_TOKEN,
        message: EXCEPTION_MESSAGE.FAILED_TO_GENERATE_OPENVIDU_TOKEN,
        error: 'OpenViduTokenGenerationFailedException',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

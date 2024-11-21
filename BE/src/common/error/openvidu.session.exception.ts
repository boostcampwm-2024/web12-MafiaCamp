import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';
import { HttpException, HttpStatus } from '@nestjs/common';

export class OpenviduSessionNotFoundException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.NOT_FOUND_OPENVIDU_SESSION,
        message: EXCEPTION_MESSAGE.NOT_FOUND_OPENVIDU_SESSION,
        error: 'OpenviduSessionNotFoundException',
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class OpenviduSessionCloseFailedException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.FAILED_TO_CLOSE_OPENVIDU_SESSION,
        message: EXCEPTION_MESSAGE.FAILED_TO_CLOSE_OPENVIDU_SESSION,
        error: 'OpenviduSessionCloseFailedException',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class OpenviduSessionCreateFailedException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.FAILED_TO_CREATE_OPENVIDU_SESSION,
        message: EXCEPTION_MESSAGE.FAILED_TO_CREATE_OPENVIDU_SESSION,
        error: 'OpenviduSessionCreateFailedException',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  ㅊ;
}

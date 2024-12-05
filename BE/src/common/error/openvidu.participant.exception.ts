import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION_CODE } from './exception.code';
import { EXCEPTION_MESSAGE } from './exception.message';

export class OpenViduParticipantDisconnectFailedException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.FAILED_TO_DISCONNECT_OPENVIDU_PARTICIPANT,
        message: EXCEPTION_MESSAGE.FAILED_TO_DISCONNECT_OPENVIDU_PARTICIPANT,
        error: 'OpenViduParticipantDisconnectFailedException',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class OpenViduParticipantListFetchFailedException extends HttpException {
  constructor() {
    super(
      {
        code: EXCEPTION_CODE.FAILED_TO_FETCH_OPENVIDU_PARTICIPANT_LIST,
        message: EXCEPTION_MESSAGE.FAILED_TO_FETCH_OPENVIDU_PARTICIPANT_LIST,
        error: 'OpenViduParticipantListFetchFailedException',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

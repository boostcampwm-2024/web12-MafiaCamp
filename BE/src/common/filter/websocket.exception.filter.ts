import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class WebsocketExceptionFilter extends BaseWsExceptionFilter {


  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const event = host.switchToWs().getPattern();

    let responseBody: Record<string, any> = {
      timestamp: new Date().toISOString(),
      event,
    };

    if (exception instanceof WsException) {
      const wsError = exception.getError() as any;
      responseBody = {
        ...responseBody,
        code: wsError.code || HttpStatus.BAD_REQUEST,
        message: wsError.message || exception.message,
        error: wsError.error || exception.name,
      };
    } else if (exception instanceof HttpException) {
      const response = exception.getResponse() as any;
      responseBody = {
        ...responseBody,
        code: response.code || exception.getStatus(),
        message: response.message || response.error,
        error: response.error || response.message,
      };
    } else {
      responseBody = {
        ...responseBody,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: exception instanceof Error ? exception.message : 'Unknown error',
      };
    }
    client.emit('error', responseBody);
  }
}
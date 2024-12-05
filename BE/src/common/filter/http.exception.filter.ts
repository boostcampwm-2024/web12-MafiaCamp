import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {
  }

  catch(exception: unknown, host: ArgumentsHost): any {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let responseBody: any = {
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
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

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { sanitizeData } from './sanitize.data';
import { BasicLoggerInterceptor } from './basic.logger.interceptor';

@Injectable()
export class HttpLoggerInterceptor extends BasicLoggerInterceptor {

  protected handleHttpRequest(context: ExecutionContext, next: CallHandler, startTime: number): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { traceId, spanId, parentSpanId } = request.traceMetadata;
    const { className, handlerName } = this.getExecutionInfo(context);
    const requestInfo = this.getRequestInfo(request);
    this.logger.info({
      message: 'Flow started',
      traceId,
      spanId,
      parentSpanId,
      class: className,
      method: handlerName,
      path: request.url,
      httpMethod: request.method,
      ...requestInfo,
    });

    return next.handle().pipe(
      tap({
        next: (response) => {
          this.logger.info({
            message: 'Flow completed',
            traceId,
            spanId,
            parentSpanId,
            duration: `${Date.now() - startTime}ms`,
            response: sanitizeData(response),
            status: 'success',
          });
        },
        error: (error) => {
          this.logger.error({
            message: 'Flow failed',
            traceId,
            spanId,
            parentSpanId,
            error: error.message,
            stack: error.stack,
          });
        },
      }),
    );
  }

  protected handleWebsocketEvent(context: ExecutionContext, next: CallHandler, startTime: number): Observable<any> {
    return undefined;
  }

  private getRequestInfo(request: any): Record<string, any> {
    const info: any = {};

    if (request.body && Object.keys(request.body).length > 0) {
      info.requestBody = sanitizeData(request.body);
    }

    if (request.params && Object.keys(request.params).length > 0) {
      info.urlParams = request.params;
    }

    if (request.query && Object.keys(request.query).length > 0) {
      info.queryParams = request.query;
    }
    return info;
  }


}

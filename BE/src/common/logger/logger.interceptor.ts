import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { traceId, spanId, parentSpanId } = request.traceMetadata;
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    const startTime = Date.now();

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
      ...requestInfo
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logger.info({
            message: 'Flow completed',
            traceId,
            spanId,
            parentSpanId,
            duration: `${Date.now() - startTime}ms`,
            status: 'success'
          });
        },
        error: (error) => {
          this.logger.error({
            message: 'Flow failed',
            traceId,
            spanId,
            parentSpanId,
            error: error.message,
            stack: error.stack
          });
        }
      })
    );
  }

  private getRequestInfo(request: any) :Record<string, any>{
    const info: any = {};

    if (request.body && Object.keys(request.body).length > 0) {
      info.requestBody = this.sanitizeData(request.body);
    }

    if (request.params && Object.keys(request.params).length > 0) {
      info.urlParams = request.params;
    }

    if (request.query && Object.keys(request.query).length > 0) {
      info.queryParams = request.query;
    }

    return info;
  }

  private sanitizeData(data: any): Record<string, any> {
    if (!data) return data;

    const sanitized = {...data};
    const sensitiveFields = ['password', 'token', 'secret'];

    sensitiveFields.forEach(field => {
      if (field in sanitized) {
        sanitized[field] = '***filtered**data***';
      }
    });

    return sanitized;
  }
}

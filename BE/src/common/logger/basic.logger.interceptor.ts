import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Observable } from 'rxjs';

@Injectable()
export abstract class BasicLoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    protected readonly logger: Logger,
  ) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const contextType = context.getType();

    if (contextType === 'http') {
      return this.handleHttpRequest(context, next, startTime);
    } else if (contextType === 'ws') {
      return this.handleWebsocketEvent(context, next, startTime);
    }

    return next.handle();
  }

  protected abstract handleHttpRequest(context: ExecutionContext, next: CallHandler, startTime: number): Observable<any>;

  protected abstract handleWebsocketEvent(context: ExecutionContext, next: CallHandler, startTime: number): Observable<any>;


  protected createLogInfo(
    traceId: string,
    spanId: string,
    parentSpanId?: string,
  ) {
    return {
      traceId,
      spanId,
      parentSpanId,
    };
  }

  protected getExecutionInfo(context: ExecutionContext) {
    return {
      className: context.getClass().name,
      handlerName: context.getHandler().name,
    };
  }

  protected getDuration(startTime: number) {
    return `${Date.now() - startTime}ms`;
  }
}

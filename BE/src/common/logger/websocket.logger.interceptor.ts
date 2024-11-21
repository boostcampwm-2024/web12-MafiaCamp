import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { sanitizeData } from './sanitize.data';
import { BasicLoggerInterceptor } from './basic.logger.interceptor';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WebsocketLoggerInterceptor extends BasicLoggerInterceptor {
  protected handleHttpRequest(
    context: ExecutionContext,
    next: CallHandler,
    startTime: number,
  ): Observable<any> {
    return next.handle();
  }

  protected handleWebsocketEvent(
    context: ExecutionContext,
    next: CallHandler,
    startTime: number,
  ): Observable<any> {
    const client = context.switchToWs().getClient();
    const data = context.switchToWs().getData() || {} ;
    const { className, handlerName } = this.getExecutionInfo(context);

    const traceId =
      client.traceId || client.handshake?.query?.traceId || `ws-${uuidv4()}`;
    const spanId = `ws-${uuidv4()}`;

    this.logger.info({
      message: 'WebSocket event started',
      traceId,
      spanId,
      class: className,
      handler: handlerName,
      event: data.event,
      payload: data ? sanitizeData(data) : undefined,
      clientId: client.id,
    });

    return next.handle().pipe(
      tap({
        next: (response) => {
          this.logger.info({
            message: 'WebSocket event completed',
            traceId,
            spanId,
            duration: `${Date.now() - startTime}ms`,
            response: sanitizeData(response),
            status: 'success',
          });
        },
        error: (error) => {
          this.logger.error({
            message: 'WebSocket event failed',
            traceId,
            spanId,
            error: error instanceof WsException ? error.message : error.toString(),
            stack: error.stack,
          });
        },
      }),
    );
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {

    const traceId = req.headers['x-trace-id'] || uuidv4();
    const spanId = uuidv4();

    req['traceMetadata'] = {
      traceId,
      spanId,
      parentSpanId: req.headers['x-span-id'],
    };

    res.setHeader('x-trace-id', traceId);
    res.setHeader('x-span-id', spanId);

    next();
  }
}
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './common/filter/global.exception.filter';

async function bootstrap() {
  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; # Node.js 환경 변수로 SSL 검증 무시
  initializeTransactionalContext();

  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '../ssl/localhost+2-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../ssl/localhost+2.pem')),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  });

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter));
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();

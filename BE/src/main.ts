import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filter/http.exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as process from 'process';

async function bootstrap() {
  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; # Node.js 환경 변수로 SSL 검증 무시
  initializeTransactionalContext();
  //
  // const httpsOptions = {
  //   key: fs.readFileSync(path.join(__dirname, '../ssl/localhost+2-key.pem')),
  //   cert: fs.readFileSync(path.join(__dirname, '../ssl/localhost+2.pem')),
  // };

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    exposedHeaders: ['X-ACCESS-TOKEN'],
  });

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);

  const shutdown = async () => {
    try {
      await logger.close();
      await app.close();
      process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));
  await app.listen(configService.get<number>('PORT'));
}

bootstrap();

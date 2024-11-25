import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';
import * as process from 'process';
import { NcloudLogTransport } from '../object/ncloud.log.transport';

const createLokiFormat = (configService: ConfigService) => {
  return winston.format.printf(
    ({ timestamp, level, message, context, ...meta }) => {
      return JSON.stringify({
        ts: timestamp,
        labels: {
          level,
          app: configService.get<string>('APPLICATION_NAME'),
          environment: configService.get<string>('NODE_ENV', 'development'),
          context: context || 'default',
        },
        content: {
          message:
            typeof message === 'object' ? JSON.stringify(message) : message,
          ...meta,
        },
      });
    },
  );
};

const koreanTimestamp = {
  format: 'YYYY-MM-DD HH:mm:ss.SSS Z',
  tz: 'Asia/Seoul',
};

export const winstonConfig = (configService: ConfigService) => {
  return {
    transports: [
      new winston.transports.Console({
        level: configService.get<string>('LOG_LEVEL', 'info'),
        format: winston.format.combine(
          winston.format.timestamp(koreanTimestamp),
          winston.format.colorize(),
          createLokiFormat(configService),
        ),
      }),
      new DailyRotateFile({
        dirname: path.join(process.cwd(), 'logs'),
        filename: '%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '7d',
        format: winston.format.combine(
          winston.format.timestamp(koreanTimestamp),
          createLokiFormat(configService),
        ),
      }),
      new NcloudLogTransport({
        configService,
        format: winston.format.combine(
          winston.format.timestamp(koreanTimestamp),
          createLokiFormat(configService),
        ),
      }),
    ],
  };
};

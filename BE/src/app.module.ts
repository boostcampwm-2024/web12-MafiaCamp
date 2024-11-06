import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './common/typeorm/typeorm.config';
import { UserModule } from './user/user.module';
import { GameUserModule } from './game-user/game-user.module';
import { GameModule } from './game/game.module';
import { LoggerModule } from './common/logger/logger.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './common/logger/logger.interceptor';
import { TraceMiddleware } from './common/logger/trace.middleware';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        typeORMConfig(configService),

    }),
    UserModule,
    GameUserModule,
    GameModule,
    LoggerModule
  ],
  providers:[
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TraceMiddleware)
      .forRoutes('*');
  }
}

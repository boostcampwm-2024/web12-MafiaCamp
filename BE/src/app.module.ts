import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoServerModule } from './video-server/video-server.module';
import { typeORMConfig } from './common/typeorm/typeorm.config';
import { UserModule } from './user/user.module';
import { GameUserModule } from './game-user/game-user.module';
import { GameModule } from './game/game.module';
import { LoggerModule } from './common/logger/logger.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLoggerInterceptor } from './common/logger/http.logger.interceptor';
import { TraceMiddleware } from './common/logger/trace.middleware';
import { WebsocketLoggerInterceptor } from './common/logger/websocket.logger.interceptor';
import { EventsModule } from './events/events.module';
import { OpenviduModule } from './openvidu/openvidu.module';
import { SocketStateModule } from './socket-state/socket-state.module';

@Module({
  imports: [
    ConfigModule.forRoot({
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
    VideoServerModule,
    EventsModule,
    LoggerModule,
    SocketStateModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: WebsocketLoggerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceMiddleware).forRoutes('*');
  }
}

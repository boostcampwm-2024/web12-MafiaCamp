import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './common/config/typeorm.config';
import { UserModule } from './user/user.module';
import { GameUserModule } from './game-user/game-user.module';
import { GameModule } from './game/game.module';

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
    GameModule
  ],
})
export class AppModule {
}

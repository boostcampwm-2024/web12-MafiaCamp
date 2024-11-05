import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './common/config/typeorm.config';
import { UserModule } from './user/user.module';

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
    UserModule
  ],
})
export class AppModule {
}

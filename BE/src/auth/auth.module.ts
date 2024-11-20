import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { TOKEN_PROVIDE_USECASE } from './usecase/token.provide.usecase';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    } as JwtModuleAsyncOptions),
  ],
  providers:[
    {
      provide: TOKEN_PROVIDE_USECASE,
      useClass: AuthService
    }
  ],
  exports:[TOKEN_PROVIDE_USECASE]
})
export class AuthModule {
}
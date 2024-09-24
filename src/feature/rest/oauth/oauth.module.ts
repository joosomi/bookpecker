import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { KakaoStrategy } from './strategies/kakao.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [OAuthController],
  providers: [OAuthService, KakaoStrategy],
})
export class OAuthModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './strategies/jwt-auth.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }, //유효기간 1시간 설정
      }),
    }),
  ],
  providers: [JwtStrategy],
  exports: [],
})
export class AuthModule {}

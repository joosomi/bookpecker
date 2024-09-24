import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';

import { OAuthModule } from './feature/rest/oauth/oauth.module';
import { winstonOptions } from './logging/logger';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    WinstonModule.forRoot(winstonOptions),
    ConfigModule.forRoot({
      isGlobal: true, // 전역 설정 - 모든 모듈에서 ConfigService 사용 가능
    }),
    PrismaModule,
    OAuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';

import { AuthModule } from './feature/auth/auth.module';
import { JwtAuthGuard } from './feature/auth/guards/jwt-auth.guard';
import { BookSearchModule } from './feature/common/book-search/book-search.module';
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
    AuthModule,
    BookSearchModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

import { join } from 'path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { WinstonModule } from 'nest-winston';

import { AuthModule } from './feature/auth/auth.module';
import { JwtAuthGuard } from './feature/auth/guards/jwt-auth.guard';
import { BookSearchModule } from './feature/common/book-search/book-search.module';
import { BookModule } from './feature/graphql/book/book.module';
import { NoteModule } from './feature/graphql/note/note.module';
import { OAuthModule } from './feature/rest/oauth/oauth.module';
import { ShareBookModule } from './feature/rest/share-book/share-book.module';
import { winstonOptions } from './logging/logger';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: false, //Code-First에서는 true
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      path: '/graphql',
      context: ({ req }) => ({ req }), // 요청마다 context에 req를 포함
      playground: true, // GraphQL Playground 활성화
      debug: true,
      introspection: true, // 인트로스펙션 활성화 (개발 환경에서만 사용)
    }),
    WinstonModule.forRoot(winstonOptions),
    ConfigModule.forRoot({
      isGlobal: true, // 전역 설정 - 모든 모듈에서 ConfigService 사용 가능
    }),
    PrismaModule,
    OAuthModule,
    AuthModule,
    BookSearchModule,
    BookModule,
    ShareBookModule,
    NoteModule,
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

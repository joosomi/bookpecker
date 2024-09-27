import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { ShareBookController } from './share-book.controller';
import { ShareBookService } from './share-book.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SHARE_SECRET'), //인증용 secret key와 다른 키 사용
        signOptions: { expiresIn: '10m' }, //외부 공유용 토큰 만료 시간은 10분
      }),
    }),
  ],
  controllers: [ShareBookController],
  providers: [ShareBookService],
})
export class ShareBookModule {}

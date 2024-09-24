import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class OAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * 카카오 프로필 정보를 받아와 사용자를 데이터베이스에서 찾고, 없으면 새로운 사용자 생성
   * 이후 JWT 토큰을 생성하여 반환
   * @param kakaoProfile - 카카오 사용자 정보 객체
   * @returns JWT 액세스 토큰
   */

  async validateKakaoUser(kakaoProfile: {
    kakaoId: string;
    email: string;
    username: string;
  }): Promise<{ accessToken: string }> {
    const { kakaoId, email, username } = kakaoProfile;

    let user = await this.prisma.user.findUnique({
      where: { kakaoId },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          kakaoId,
          email,
          username,
        },
      });
    }

    // JWT 토큰 생성
    const payload = { sub: user.id, email: user.email, username: user.username };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}

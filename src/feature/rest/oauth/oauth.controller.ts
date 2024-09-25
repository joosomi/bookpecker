import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '../../auth/decorators/public.decorator';

import { OAuthService } from './oauth.service';

@ApiTags('OAuth Controller')
@Controller('auth')
export class OAuthController {
  constructor(private readonly OAuthService: OAuthService) {}

  /**
   * Passport의 Kakao Strategy를 사용하여
   * 카카오 로그인 페이지로 사용자를 리다이렉트
   */

  @Get('kakao')
  @Public()
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth(): Promise<void> {
    // AuthGuard가 카카오 로그인 페이지로 리다이렉트
  }

  /**
   * 카카오 인증이 완료된 후 호출되는 콜백 엔드포인트
   * @param req - 인증된 사용자 정보가 담긴 요청 객체
   * @returns JWT 액세스 토큰
   */
  @Get('kakao/callback')
  @Public()
  @UseGuards(AuthGuard('kakao'))
  kakaoAuthCallback(@Req() req: Request): { accessToken: string } {
    const token = req['user'];
    const { accessToken } = token;

    return { accessToken };
  }
}

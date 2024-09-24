import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { OAuthService } from './oauth.service';

@Controller('auth')
export class OauthController {
  constructor(private readonly OAuthService: OAuthService) {}

  /**
   * 카카오 인가 코드 발급, 카카오 인증 URL로 302 리다이렉트
   * CHECK) KAKAO Developers Redirect URI 설정
   * @param res
   * @returns void
   */
  @Get('kakao')
  async kakaoAuth(@Res() res: Response): Promise<void> {
    const kakaoAuthURL = this.OAuthService.getKakaoAuthURL();
    return res.redirect(kakaoAuthURL);
  }
}

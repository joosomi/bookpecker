import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';

import { OAuthService } from '../oauth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly oAuthService: OAuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      callbackURL: configService.get<string>('KAKAO_REDIRECT_URI'),
    });
  }

  /**
   * 카카오 인증이 완료되면 사용자 정보를 받아와 validateKakaoUser로 해당 사용자 정보가 있는지 조회, 없으면 DB 저장
   * @param accessToken - 카카오에서 발급된 액세스 토큰
   * @param refreshToken - 카카오에서 발급된 리프레시 토큰
   * @param profile - 카카오 사용자 프로필 정보
   * @param done - Passport에서 제공하는 콜백 함수
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: CallableFunction,
  ): Promise<void> {
    try {
      const { id, _json: kakaoJson } = profile;
      const kakaoAccount = kakaoJson.kakao_account;

      const accessToken = await this.oAuthService.validateKakaoUser({
        kakaoId: id.toString(),
        email: kakaoAccount.email,
        username: kakaoAccount.profile.nickname,
      });

      done(null, accessToken); //  JWT 액세스 토큰 req.user에 저장
    } catch (err) {
      done(err, false);
    }
  }
}

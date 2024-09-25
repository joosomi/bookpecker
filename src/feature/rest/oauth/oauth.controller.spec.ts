import { ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';

describe('OAuthController', () => {
  let controller: OAuthController;

  const mockOAuthService = {
    validateKakaoUser: jest.fn().mockResolvedValue({ accessToken: 'test_token' }),
  };

  class MockAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      request.user = { accessToken: 'test_token' };
      return true; // 모든 요청을 허용 - contoller로 전달
    }
  }

  interface RequestWithUser extends Request {
    user: { accessToken: string };
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OAuthController],
      providers: [
        {
          provide: OAuthService,
          useValue: mockOAuthService,
        },
        Reflector, // Reflector를 주입하여 가드에서 사용
      ],
    })
      .overrideGuard(AuthGuard('kakao')) // 'kakao' 가드를 MockAuthGuard로 대체
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<OAuthController>(OAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('kakaoAuth', () => {
    it('should be defined', () => {
      expect(controller.kakaoAuth).toBeDefined();
    });

    /**
     * kakaoAuth 메소드: 실제로 AuthGuard가 redirect
     * -> undefined를 반환
     */
    it('should return undefined', async () => {
      const result = await controller.kakaoAuth();
      expect(result).toBeUndefined();
    });
  });

  /**
   * kakaoAuthCallback 메서드가 accessToken을 반환하는지 테스트
   */
  describe('kakaoAuthCallback', () => {
    it('should return accessToken', () => {
      const mockRequest = {
        user: { accessToken: 'test_token' },
      } as RequestWithUser;

      const result = controller.kakaoAuthCallback(mockRequest);
      expect(result).toEqual({ accessToken: 'test_token' });
    });
  });
});

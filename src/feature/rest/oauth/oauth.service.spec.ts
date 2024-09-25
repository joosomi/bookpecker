import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../../prisma/prisma.service';

import { OAuthService } from './oauth.service';

describe('OAuthService', () => {
  let service: OAuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OAuthService>(OAuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateKakaoUser', () => {
    it('기존 사용자에 대해 accessToken을 반환해야 합니다', async () => {
      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@test.com',
        username: 'Test User',
      };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (jwtService.sign as jest.Mock).mockReturnValue('mockedAccessToken');

      const result = await service.validateKakaoUser({
        kakaoId: '1234567890',
        email: 'test@test.com',
        username: 'Test User',
      });

      expect(result).toEqual({ accessToken: 'mockedAccessToken' });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { kakaoId: '1234567890' },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@test.com',
        username: 'Test User',
      });
    });

    it('새로운 사용자를 생성하고 accessToken을 반환해야 합니다', async () => {
      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@test.com',
        username: 'Test User',
      };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prismaService.user.create as jest.Mock).mockResolvedValue(mockUser);
      (jwtService.sign as jest.Mock).mockReturnValue('mockedAccessToken');

      const result = await service.validateKakaoUser({
        kakaoId: '1234567890',
        email: 'test@test.com',
        username: 'Test User',
      });

      expect(result).toEqual({ accessToken: 'mockedAccessToken' });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { kakaoId: '1234567890' },
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { kakaoId: '1234567890', email: 'test@test.com', username: 'Test User' },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@test.com',
        username: 'Test User',
      });
    });
  });
});

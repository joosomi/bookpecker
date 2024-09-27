import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../../prisma/prisma.service';

import { CreateBookSharTokenDto } from './dto/create-book-share-token.dto';
import { SharedBookResponse } from './types/shared-book-response.type';

@Injectable()
export class ShareBookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 외부 공유용 JWT 토큰 생성
   * @param createBookShareTokenDto
   * @param user - 현재 로그인한 사용자 정보 (ID, 이메일, 사용자명)
   * @returns 생성된 JWT 토큰과 만료 시간(10분)
   */
  async createShareToken(
    createBookShareTokenDto: CreateBookSharTokenDto,
    user: { id: string; email: string; username: string },
  ): Promise<{ token: string; expiresAt: Date }> {
    const { bookId } = createBookShareTokenDto;
    const userId = user.id;

    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('해당 책을 공유하려면 먼저 저장해주세요.');
    }

    // 사용자가 해당 책을 저장하였는지 확인(외부 공유할 수 있는지 체크)
    const userBook = await this.prisma.userBook.findFirst({
      where: { bookId, userId },
    });

    if (!userBook) {
      throw new NotFoundException('해당 책을 공유하려면 먼저 저장해주세요.');
    }

    // JWT 토큰 생성 (10분 뒤 만료됨)
    const payload = { bookId, userId };
    const token = this.jwtService.sign(payload);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 현재 시점으로부터 10분 후

    return { token, expiresAt };
  }

  /**
   * 공유된 책/노트 정보 가져오기
   * @param token - 공유용 JWT 토큰
   * @returns 책 정보와 해당 책에 작성된 노트 목록
   */
  async getSharedBook(token: string): Promise<SharedBookResponse> {
    try {
      // JWT 공유용 토큰 유효성 검증
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SHARE_SECRET'),
      });

      const { bookId, userId } = payload;

      // 해당 책의 정보 가져오기
      const book = await this.prisma.book.findUnique({
        where: { id: bookId },
      });

      if (!book) {
        throw new NotFoundException('공유된 책의 정보를 찾을 수 없습니다.');
      }

      // 해당 책의 노트 정보 가져오기
      const notes = await this.prisma.note.findMany({
        where: { bookId, userId },
      });

      return {
        book,
        notes,
      };
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        // JWT 관련 에러 (만료 포함)를 401 Unauthorized로 처리
        throw new UnauthorizedException('공유 링크에 접근할 수 없습니다.');
      }

      throw err;
    }
  }
}

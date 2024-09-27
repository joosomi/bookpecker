import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../../prisma/prisma.service';

import { CreateBookSharTokenDto } from './dto/create-book-share-token.dto';

@Injectable()
export class ShareBookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
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
      throw new BadRequestException('해당 책을 공유하려면 먼저 저장해주세요.');
    }

    // 사용자가 해당 책을 저장하였는지 확인(외부 공유할 수 있는지 체크)
    const userBook = await this.prisma.userBook.findFirst({
      where: { bookId, userId },
    });

    if (!userBook) {
      throw new BadRequestException('해당 책을 공유하려면 먼저 저장해주세요.');
    }

    // JWT 토큰 생성 (10분 뒤 만료됨)
    const payload = { bookId, userId };
    const token = this.jwtService.sign(payload);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 현재 시점으로부터 10분 후

    return { token, expiresAt };
  }
}

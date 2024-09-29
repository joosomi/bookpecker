/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, NotFoundException } from '@nestjs/common';

import { Book } from '../../../graphql';
import { PrismaService } from '../../../prisma/prisma.service';

import { SaveBookInput } from './dto/save-book.input';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 모든 책 조회
   * 데이터베이스에 저장된 모든 책 목록을 반환합니다. Book Table
   * @returns 모든 책의 배열
   */
  async findAll(): Promise<Book[]> {
    return this.prisma.book.findMany(); // 모든 책을 반환하는 메서드
  }

  async saveBook(input: SaveBookInput, userId: string): Promise<Book> {
    // ISBN을 기준으로 책이 이미 저장되어 있는지 확인
    let book = await this.prisma.book.findUnique({
      where: { isbn: input.isbn, deletedAt: null },
    });

    if (!book) {
      // pubDate를 Date 타입으로 변환
      const pubDate = input.pubDate
        ? new Date(
            `${input.pubDate.slice(0, 4)}-${input.pubDate.slice(4, 6)}-${input.pubDate.slice(6, 8)}T00:00:00Z`,
          )
        : null;

      book = await this.prisma.book.create({
        data: {
          title: input.title,
          author: input.author,
          isbn: input.isbn,
          link: input.link,
          publisher: input.publisher,
          pubDate: pubDate,
          description: input.description,
          imageUrl: input.imageUrl,
        },
      });
    }

    // userBook에 이미 저장되어 있는지 확인(중복 연결 방지)
    const userBook = await this.prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId: userId,
          bookId: book.id,
        },
      },
    });

    if (!userBook) {
      await this.prisma.userBook.create({
        data: {
          user: {
            connect: { id: userId },
          },
          book: {
            connect: { id: book.id },
          },
        },
      });
    }

    return book;
  }

  /**
   * 책 좋아요 토글 기능
   * @throws NotFoundException - 해당 책이 사용자에게 저장되지 않았을 경우
   */
  async toggleLike(userId: string, bookId: string): Promise<boolean> {
    const userBook = await this.prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
        deletedAt: null,
      },
    });

    if (!userBook) {
      throw new NotFoundException('해당 책을 찾을 수 없거나 저장되지 않은 책입니다.');
    }

    const updatedUserBook = await this.prisma.userBook.update({
      where: {
        id: userBook.id,
      },
      data: {
        isLiked: !userBook.isLiked,
      },
    });

    return updatedUserBook.isLiked;
  }
}

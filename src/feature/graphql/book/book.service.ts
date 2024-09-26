/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@nestjs/common';
import { Book } from '@prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';

import { SaveBookInput } from './dto/save-book.input';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Book[]> {
    return this.prisma.book.findMany(); // 모든 책을 반환하는 메서드
  }

  async saveBook(input: SaveBookInput, userId: string): Promise<Book> {
    // ISBN을 기준으로 책이 이미 저장되어 있는지 확인
    let book = await this.prisma.book.findUnique({
      where: { isbn: input.isbn },
    });

    if (!book) {
      // pubDate를 Date 타입으로 변환
      const pubDate = this.parseDateString(input.pubDate);

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

  private parseDateString(dateString: string): Date | undefined {
    if (!dateString) return undefined;

    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(4, 6), 10) - 1; // 월은 0-based
    const day = parseInt(dateString.slice(6, 8), 10);

    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? undefined : date;
  }
}

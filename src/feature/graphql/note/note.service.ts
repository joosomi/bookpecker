/* eslint-disable @typescript-eslint/naming-convention */
import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

import { CreateNoteInput } from './dto/create-note-dto';
import { Note } from './dto/note.model';

@Injectable()
export class NoteService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 노트 생성 (로그인한 사용자, 여러 개의 노트 작성 가능, 책을 저장한 사용자만 노트 작성 가능)
   * @param userId - 사용자 ID
   * @param input - 노트 생성 입력
   * @returns 생성된 노트
   */
  async createNote(input: CreateNoteInput, userId: string): Promise<Note> {
    // 사용자가 해당 책을 저장하고 있는지 확인
    const userBook = await this.prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId: input.bookId,
        },
      },
    });

    if (!userBook) {
      throw new ForbiddenException('해당 책에 대해 노트를 작성할 수 없습니다.');
    }

    // 노트 생성
    const note = await this.prisma.note.create({
      data: {
        content: input.content,
        user: {
          connect: { id: userId },
        },
        book: {
          connect: { id: input.bookId },
        },
      },
      include: {
        book: true, // Book 관계 포함
        user: true,
      },
    });

    return note;
  }

  async getNotesByBook(bookId: string, userId: string): Promise<Note[]> {
    // UserBook을 통해 사용자가 해당 책에 접근 권한이 있는지 확인
    const userBook = await this.prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId: userId,
          bookId: bookId,
        },
      },
    });

    if (!userBook) {
      throw new ForbiddenException('해당 책에 대한 접근 권한이 없습니다.');
    }

    const prismaNotes = await this.prisma.note.findMany({
      where: {
        bookId,
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        book: true,
        user: true,
      },
    });

    const graphqlNotes: Note[] = prismaNotes.map((note) => ({
      id: note.id,
      content: note.content,
      book: note.book,
      user: note.user,
    }));

    return graphqlNotes;
  }
}

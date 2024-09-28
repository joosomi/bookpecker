import { BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Note } from '@prisma/client';

import { CreateNoteInput } from './dto/create-note-dto';
import { NoteService } from './note.service';

@Resolver('Note')
export class NoteResolver {
  constructor(private readonly noteService: NoteService) {}

  /**
   * 노트 생성
   * @param input - bookId, content
   * @param context GraphQL 요청 컨텍스트 (JWT 인증된 사용자 정보 포함)
   * @returns 생성된 노트
   */
  @Mutation()
  async createNote(@Args('input') input: CreateNoteInput, @Context() context): Promise<Note> {
    try {
      const userId = context.req.user.id;

      if (!userId) {
        throw new UnauthorizedException('사용자 인증이 필요합니다.');
      }
      const note = await this.noteService.createNote(input, userId);
      if (!note) {
        throw new BadRequestException('노트 생성에 실패했습니다.');
      }
      return note;
    } catch (err) {
      if (err instanceof ForbiddenException || err instanceof BadRequestException) {
        throw err;
      }
      throw new Error('노트를 작성하는 중 오류가 발생했습니다.');
    }
  }
}

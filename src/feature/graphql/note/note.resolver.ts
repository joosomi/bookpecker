import { BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';

import { CreateNoteInput } from './dto/create-note-dto';
import { Note } from './dto/note.model';
import { UpdateNoteInput } from './dto/update-note-dto';
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

  /**
   * 해당 책에 대한 모든 노트 조회
   * @param bookId
   * @param context
   * @returns
   */
  @Query()
  async getNotesByBook(
    @Args('bookId', { type: () => String }) bookId: string,
    @Context() context,
  ): Promise<Note[]> {
    try {
      const userId = context.req.user.id;
      if (!userId) {
        throw new UnauthorizedException('사용자 인증이 필요합니다.');
      }
      const notes = await this.noteService.getNotesByBook(bookId, userId);
      return notes;
    } catch (err) {
      if (err instanceof UnauthorizedException || err instanceof ForbiddenException) {
        throw err;
      }
      throw new Error(`노트를 조회하는 중 오류가 발생했습니다: ${err.message}`);
    }
  }

  @Query()
  async getNoteById(
    @Args('noteId', { type: () => String }) noteId: string,
    @Context() context,
  ): Promise<Note> {
    try {
      const userId = context.req.user.id;
      if (!userId) {
        throw new UnauthorizedException('사용자 인증이 필요합니다.');
      }
      const note = await this.noteService.getNoteById(noteId, userId);

      return note;
    } catch (err) {
      if (err instanceof UnauthorizedException || err instanceof ForbiddenException) {
        throw err;
      }
      throw new Error(`노트를 조회하는 중 오류가 발생했습니다: ${err.message}`);
    }
  }

  @Mutation(() => Note, { name: 'updateNote' })
  async updateNote(
    @Args('noteId', { type: () => String }) noteId: string,
    @Args('input', { type: () => UpdateNoteInput }) input: UpdateNoteInput,
    @Context() context,
  ): Promise<Note> {
    const userId = context.req.user.id;
    if (!userId) {
      throw new UnauthorizedException('사용자 인증이 필요합니다.');
    }
    return this.noteService.updateNote(noteId, userId, input);
  }

  @Mutation(() => Boolean, { name: 'deleteNote' })
  async deleteNote(
    @Args('noteId', { type: () => String }) noteId: string,
    @Context() context,
  ): Promise<boolean> {
    const userId = context.req.user.id;
    if (!userId) {
      throw new UnauthorizedException('사용자 인증이 필요합니다.');
    }
    return this.noteService.deleteNote(noteId, userId);
  }
}

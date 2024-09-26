/* eslint-disable @typescript-eslint/no-unused-vars */
import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';

import { BookService } from './book.service';
import { SaveBookInput } from './dto/save-book.input';
import { Book } from './models/book.model';

@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  /**
   * 모든 책 목록을 조회하는 쿼리
   * @returns 저장된 모든 책 리스트
   */
  @Query(() => [Book], { name: 'getAllBooks' })
  async getAllBooks(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  /**
   * 책을 저장하는 뮤테이션
   * @param input - 저장할 책 정보 (SaveBookInput DTO)
   * @param context - GraphQL 요청 컨텍스트 (JWT 인증된 사용자 정보 포함)
   * @returns 저장된 책 정보
   */
  @Mutation(() => Book)
  async saveBook(@Args('input') input: SaveBookInput, @Context() context): Promise<Book> {
    try {
      const userId = context.req.user.id;
      if (!userId) {
        throw new Error('사용자 ID를 찾을 수 없습니다.');
      }
      return await this.bookService.saveBook(input, userId);
    } catch (err) {
      throw new Error('책을 저장하는 중 오류가 발생했습니다.');
    }
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';

import { Book } from '../../../graphql';

import { BookService } from './book.service';
import { SaveBookInput } from './dto/save-book.input';
import { ToggleLikeInput } from './dto/toggle-like.input';

@Resolver('Book')
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  /**
   * 모든 책 목록을 조회하는 쿼리
   * @returns 저장된 모든 책 리스트
   */
  @Query(() => [Book])
  async getAllBooks() {
    return this.bookService.findAll();
  }

  /**
   * 책을 저장하는 뮤테이션
   * @param input - 저장할 책 정보 (SaveBookInput DTO)
   * @param context - GraphQL 요청 컨텍스트 (JWT 인증된 사용자 정보 포함)
   * @returns 저장된 책 정보
   */
  @Mutation(() => Book)
  async saveBook(@Args('input') input: SaveBookInput, @Context() context) {
    try {
      const userId = context.req.user.id;
      if (!userId) {
        throw new UnauthorizedException('사용자 인증이 필요합니다.');
      }
      return await this.bookService.saveBook(input, userId);
    } catch (err) {
      console.log(err);
      throw new Error('책을 저장하는 중 오류가 발생했습니다.');
    }
  }

  /**
   * 책 좋아요 토글 기능
   * 이미 좋아요를 눌렀다면 취소, 아직 좋아요를 누르지 않았다면 좋아요 true
   * @param input ToggleLikeInput DTO - bookId
   * @param context GraphQL 요청 컨텍스트 (JWT 인증된 사용자 정보 포함)
   * @returns 좋아요 상태 변경된 결과 (true/false)
   */
  @Mutation(() => Boolean)
  async toggleLike(@Args('input') input: ToggleLikeInput, @Context() context) {
    const userId = context.req.user.id;
    if (!userId) {
      throw new UnauthorizedException('사용자 인증이 필요합니다.');
    }
    if (!input.bookId) {
      throw new BadRequestException('책 ID가 제공되지 않았습니다.');
    }
    return this.bookService.toggleLike(userId, input.bookId);
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BookSearchService } from './book-search.service';
import { BookSearchDto } from './dto/book-search.dto';
import { NaverBookSearchResponse } from './types/naver-api.types';

@ApiTags('Books')
@Controller('books')
export class BookSearchController {
  constructor(private readonly bookSearchService: BookSearchService) {}

  /**
   * 네이버 책 검색 API를 사용한 책 검색 기능
   * @param bookSearchDto
   * @returns
   */
  @Get('search')
  @ApiOperation({ summary: '책 검색', description: 'Naver API를 사용하여 책을 검색합니다.' })
  @ApiResponse({ status: 200, description: '검색 성공', type: NaverBookSearchResponse })
  @ApiResponse({
    status: 401,
    description: '접근 권한이 없는 경우 (비로그인/JWT 액세스 토큰이 유효하지 않은 사용자)',
  })
  @ApiBearerAuth('access_token')
  async searchBooks(@Query() bookSearchDto: BookSearchDto): Promise<NaverBookSearchResponse> {
    return await this.bookSearchService.searchBooks(bookSearchDto);
  }
}

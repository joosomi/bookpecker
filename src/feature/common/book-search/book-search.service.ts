/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { BookSearchDto } from './dto/book-search.dto';
import { NaverBookSearchResponse } from './types/naver-api.types';

@Injectable()
export class BookSearchService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Naver API를 사용하여 책 검색
   * @param BookSearchDto 검색 쿼리
   * @returns 검색된 책 목록
   */
  async searchBooks(bookSearchDto: BookSearchDto): Promise<NaverBookSearchResponse> {
    const { query, display, start, sort } = bookSearchDto;
    const clientId = this.configService.get<string>('NAVER_CLIENT_ID');
    const clientSecret = this.configService.get<string>('NAVER_CLIENT_SECRET');

    try {
      // firstValueFrom()은 Observable에서 첫 번째로 방출되는 값을 Promise로 변환
      const response = await firstValueFrom(
        this.httpService.get<NaverBookSearchResponse>(
          'https://openapi.naver.com/v1/search/book.json',
          {
            params: { query, display, start, sort },
            headers: {
              'X-Naver-Client-Id': clientId,
              'X-Naver-Client-Secret': clientSecret,
            },
          },
        ),
      );

      return response.data;
    } catch (err) {
      throw new InternalServerErrorException(
        '죄송합니다. 현재 책 검색 서비스에 문제가 발생하였습니다.',
      );
    }
  }
}

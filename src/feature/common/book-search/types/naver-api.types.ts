import { ApiProperty } from '@nestjs/swagger';

export class NaverBookItem {
  @ApiProperty({ description: '책 제목' })
  title: string;

  @ApiProperty({ description: '책 상세 링크' })
  link: string;

  @ApiProperty({ description: '책 표지 이미지 URL' })
  image: string;

  @ApiProperty({ description: '저자' })
  author: string;

  @ApiProperty({ description: '책 가격' })
  discount: string;

  @ApiProperty({ description: '출판사' })
  publisher: string;

  @ApiProperty({ description: '출판 날짜(yyyymmdd)' })
  pubdate: string;

  @ApiProperty({ description: 'ISBN 번호', example: '123-456-7890' })
  isbn: string;

  @ApiProperty({ description: '책 설명' })
  description: string;
}

export class NaverBookSearchResponse {
  @ApiProperty({ description: '응답 생성 날짜' })
  lastBuildDate: string;

  @ApiProperty({ description: '총 검색 결과 수' })
  total: number;

  @ApiProperty({ description: '페이지 시작 번호' })
  start: number;

  @ApiProperty({ description: '페이지 내 결과 수' })
  display: number;

  @ApiProperty({ description: '검색된 책 목록', type: [NaverBookItem] })
  items: NaverBookItem[];
}

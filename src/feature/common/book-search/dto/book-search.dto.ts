import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum, Min, Max } from 'class-validator';

export enum SortOption {
  SIM = 'sim', //정확도순 내림차순 정렬 (default)
  DATE = 'date', //출간일순으로 내림차순
}

export class BookSearchDto {
  @ApiProperty({ description: '검색어' })
  @IsString()
  @IsNotEmpty()
  query: string; //검색어(UTF-8로 인코딩되어야 함)

  @ApiPropertyOptional({
    description: '한 번에 표시할 검색 결과 개수 (기본값: 10, 최댓값: 100)',
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  display?: number; //한 번에 표시할 검색 결과 개수(기본값: 10, 최댓값: 100)

  @ApiPropertyOptional({ description: '검색 시작 위치 (기본값: 1, 최댓값: 1000)', default: 1 })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(1000)
  start?: number; //검색 시작 위치(기본값: 1, 최댓값: 1000)

  @ApiPropertyOptional({ description: '정렬 옵션', enum: SortOption })
  @IsOptional()
  @IsEnum(SortOption)
  sort?: SortOption; //정렬
}

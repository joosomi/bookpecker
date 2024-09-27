import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateBookSharTokenDto } from './dto/create-book-share-token.dto';
import { ShareBookService } from './share-book.service';

@ApiTags('Book')
@Controller('books')
export class ShareBookController {
  constructor(private readonly shareBookService: ShareBookService) {}

  /**
   * 외부 공유를 위한 JWT 토큰 생성 (해당 책을 저장했는지 확인, 로그인한 사용자만 공유 토큰 생성이 가능함)
   * @param createBookShareTokenDto
   * @param - req : 현재 요청 객체 (사용자 정보 포함)
   * @returns 생성된 JWT 토큰과 만료 시간(10분)
   */
  @Post('/share')
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '책/노트 외부 공유용 토큰 생성',
    description: '외부 공유용 JWT 토큰을 생성합니다. 생성된 토큰은 10분 동안 유효합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '공유 토큰이 성공적으로 생성되었습니다.',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        expiresAt: '2024-09-28T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청으로 인한 공유 토큰 생성에 실패한 경우',
    schema: {
      example: {
        statusCode: 400,
        message: '공유할 책의 ID를 입력해주세요. or 해당 책을 공유하려면 먼저 저장해주세요.',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우, 인증되지 않은 사용자의 요청인 경우',
    schema: {
      example: {
        statusCode: 401,
        message: '사용자 인증에 실패하였습니다. 다시 로그인 해주세요.',
      },
    },
  })
  async createShareToken(
    @Body() createBookShareTokenDto: CreateBookSharTokenDto,
    @Request() req,
  ): Promise<{ token: string; expiresAt: Date }> {
    const user = req.user;
    return this.shareBookService.createShareToken(createBookShareTokenDto, user);
  }
}

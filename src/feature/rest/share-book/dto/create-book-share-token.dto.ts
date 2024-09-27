import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBookSharTokenDto {
  @ApiProperty({
    description: '외부 공유할 책의 ID(uuid)',
    example: '123e4567-e89b-12d3-a456-426614174000', // 예시 UUID
    required: true,
  })
  @IsUUID()
  @IsNotEmpty({ message: '공유할 책의 ID를 입력해주세요.' })
  bookId: string; //외부 공유할 책의 UUID
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBookSharTokenDto {
  @ApiProperty({
    description: '외부 공유할 책의 ID(uuid)',
    example: '5f083d79-a2f0-47d4-9113-de78e88ee3e4', // 예시 UUID
    required: true,
  })
  @IsUUID()
  @IsNotEmpty({ message: '공유할 책의 ID를 입력해주세요.' })
  bookId: string; //외부 공유할 책의 UUID
}

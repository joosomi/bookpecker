import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class ToggleLikeInput {
  @Field()
  @IsNotEmpty({ message: '책 ID는 필수입니다.' })
  @IsUUID('4', { message: '유효한 UUID 형식이어야 합니다.' })
  bookId: string;
}

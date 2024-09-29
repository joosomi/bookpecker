import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateNoteInput {
  @Field(() => ID)
  @IsUUID('4', { message: '유효한 책의 ID를 입력해주세요.' })
  @IsNotEmpty({ message: '유효한 책의 ID를 입력해주세요.' })
  bookId: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: '작성할 노트의 내용을 입력해주세요.' })
  content: string;
}

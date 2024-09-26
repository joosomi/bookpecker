import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

@InputType()
export class SaveBookInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  author: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  link?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  publisher?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  pubDate?: string; //YYYYMMDD 형식으로 받음

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

// src/feature/graphql/book/dto/book.model.ts

import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Book {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  author: string;

  @Field()
  isbn: string;

  @Field({ nullable: true })
  link?: string;

  @Field()
  publisher: string;

  @Field()
  pubDate: Date;

  @Field()
  description: string;

  @Field()
  imageUrl: string;
}

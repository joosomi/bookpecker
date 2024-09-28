// src/feature/graphql/note/dto/note.model.ts

import { ObjectType, Field, ID } from '@nestjs/graphql';

import { Book } from './book.model';
import { User } from './user.model';

@ObjectType()
export class Note {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => Book)
  book: Book;

  @Field(() => User)
  user: User;
}

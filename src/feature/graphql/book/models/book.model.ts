import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';

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

  @Field({ nullable: true })
  publisher?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  pubDate?: Date;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field({ nullable: true })
  isLiked?: boolean;
}

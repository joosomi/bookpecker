// src/feature/graphql/user/dto/user.model.ts

import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;
}

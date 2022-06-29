import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Book {
  @Field(() => Int, { description: "Unique Id" })
  id: number;

  @Field({ description: "Name of the Book" })
  name: string;
}

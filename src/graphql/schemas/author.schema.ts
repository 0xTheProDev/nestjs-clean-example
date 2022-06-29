import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Book } from "./book.schema";

@ObjectType()
export class Author {
  @Field(() => Int, { description: "Unique Id" })
  id: number;

  @Field({ description: "First Name of the Author" })
  firstName: string;

  @Field({ description: "Last Name of the Author" })
  lastName: string;

  @Field(() => [Book], {
    description: "Books written by the Author",
    nullable: "items",
  })
  books: Book[];
}

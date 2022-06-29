import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Book, CreateBookDto } from "./book.schema";

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

@InputType()
export class AddBookDto extends CreateBookDto {
  @Field(() => Int, { description: "Unique Id of the Author" })
  authorId: number;
}

@InputType()
export class CreateAuthorDto {
  @Field({ description: "First Name of the Author" })
  firstName: string;

  @Field({ description: "Last Name of the Author" })
  lastName: string;
}

@InputType()
export class UpdateAuthorDto {
  @Field(() => Int, { description: "Unique Id" })
  id: number;

  @Field({ description: "First Name of the Author" })
  firstName: string;

  @Field({ description: "Last Name of the Author" })
  lastName: string;
}

@InputType()
export class DeleteAuthorDto {
  @Field(() => Int, { description: "Unique Id" })
  id: number;
}

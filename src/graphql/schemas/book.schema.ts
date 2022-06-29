import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Book {
  @Field(() => Int, { description: "Unique Id" })
  id: number;

  @Field({ description: "Name of the Book" })
  name: string;
}

@InputType()
export class CreateBookDto {
  @Field({ description: "Name of the Book" })
  name: string;
}

@InputType()
export class UpdateBookDto {
  @Field(() => Int, { description: "Unique Id" })
  id: number;

  @Field({ description: "Name of the Book" })
  name: string;
}

@InputType()
export class DeleteBookDto {
  @Field(() => Int, { description: "Unique Id" })
  id: number;
}

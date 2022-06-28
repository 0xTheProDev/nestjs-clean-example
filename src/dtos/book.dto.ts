import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsInt } from "class-validator";
import { AuthorDto } from "./author.dto";

export class BookDto {
  @ApiProperty({ example: 1, description: "Unique Id of the Book" })
  readonly id: number;

  @ApiProperty({
    example: "Harry Potter and The Philosopher's Stone",
    description: "Name of the Book",
  })
  readonly name: string;

  @ApiProperty({
    description: "Name of the Authors",
    type: [AuthorDto],
  })
  readonly authors: AuthorDto[];
}

export class CreateBookDto {
  @ApiProperty({
    example: "Harry Potter and The Philosopher's Stone",
    description: "Name of the Book",
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}

export class UpdateBookDto {
  @ApiProperty({
    example: 1,
    description: "Unique Id of the Book",
    required: false,
  })
  @IsInt()
  readonly id?: number;

  @ApiProperty({
    example: "Harry Potter and The Philosopher's Stone",
    description: "Name of the Book",
    required: true,
  })
  @IsString()
  readonly name: string;
}

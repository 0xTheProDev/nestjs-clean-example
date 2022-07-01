import { IsString, IsNotEmpty, IsInt } from "class-validator";
import { AuthorDto } from "./author.dto";

export class BookDto {
  /**
   * Unique Id of the Book
   * @example 1
   */
  readonly id: number;

  /**
   * Name of the Book
   * @example Harry Potter and The Philosopher's Stone
   */
  readonly name: string;

  /**
   * Name of the Authors
   */
  readonly authors: AuthorDto[] = [];
}

export class CreateBookDto {
  /**
   * Name of the Book
   * @example Harry Potter and The Philosopher's Stone
   */
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}

export class UpdateBookDto {
  /**
   * Unique Id of the Book
   * @example 1
   */
  @IsInt()
  readonly id?: number;

  /**
   * Name of the Book
   * @example Harry Potter and The Philosopher's Stone
   */
  @IsString()
  readonly name: string;
}

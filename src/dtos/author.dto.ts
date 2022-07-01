import { IsString, IsNotEmpty, IsInt } from "class-validator";

export class AddAuthorDto {
  /**
   * Unique Id of the Author
   * @example 1
   */
  @IsInt()
  @IsNotEmpty()
  readonly id: number;
}

export class AuthorDto {
  /**
   * Unique Id of the Author
   * @example 1
   */
  readonly id: number;

  /**
   * First name of the Author
   * @example JK
   */
  readonly firstName: string;

  /**
   * Last name of the Author
   * @example Rowling
   */
  readonly lastName: string;
}

export class CreateAuthorDto {
  /**
   * First name of the Author
   * @example JK
   */
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  /**
   * Last name of the Author
   * @example Rowling
   */
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;
}

export class UpdateAuthorDto {
  /**
   * Unique Id of the Author
   * @example 1
   */
  @IsInt()
  readonly id?: number;

  /**
   * First name of the Author
   * @example JK
   */
  @IsString()
  readonly firstName?: string;

  /**
   * Last name of the Author
   * @example Rowling
   */
  @IsString()
  readonly lastName?: string;
}

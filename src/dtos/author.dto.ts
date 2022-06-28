import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateAuthorDto {
  @ApiProperty({ example: "JK", description: "First name of the Author" })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({ example: "Rowling", description: "Last name of the Author" })
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;
}

export class AuthorDto {
  @ApiProperty({ example: 1, description: "Unique Id of the Author" })
  readonly id: number;

  @ApiProperty({ example: "JK", description: "First name of the Author" })
  readonly firstName: string;

  @ApiProperty({ example: "Rowling", description: "Last name of the Author" })
  readonly lastName: string;
}

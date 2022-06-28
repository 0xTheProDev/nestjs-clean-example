import { IsString, IsNotEmpty } from "class-validator";

export class CreateAuthorDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}

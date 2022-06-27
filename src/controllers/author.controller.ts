import { Author } from "@entities/author.entity";
import { Controller, Get } from "@nestjs/common";
import { AuthorService } from "@services/author.service";

@Controller()
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  getAuthors(): Promise<Author[]> {
    return this.authorService.findAll();
  }
}

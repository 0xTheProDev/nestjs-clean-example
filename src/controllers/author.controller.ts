import { Author } from "@entities/author.entity";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthorService } from "@services/author.service";
import { CreateAuthorDto } from "@dtos/author.dto";

@Controller("authors")
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  getAuthors(): Promise<Author[]> {
    return this.authorService.findAll();
  }

  @Post()
  addAuthor(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    const author = new Author();
    author.firstName = createAuthorDto.firstName;
    author.lastName = createAuthorDto.lastName;
    return this.authorService.addOrUpdate(author);
  }
}

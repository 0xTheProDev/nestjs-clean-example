import { Author } from "@entities/author.entity";
import { Body, Controller, Get, Post } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AuthorService } from "@services/author.service";
import { AuthorDto, CreateAuthorDto } from "@dtos/author.dto";

@ApiTags("Author")
@Controller("authors")
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  @ApiOperation({ summary: "List all Authors" })
  @ApiOkResponse({
    status: 200,
    description: "Found list of Authors",
    type: [AuthorDto],
  })
  getAuthors(): Promise<Author[]> {
    return this.authorService.findAll();
  }

  @Post()
  @ApiOperation({ summary: "Create a new Author" })
  @ApiCreatedResponse({
    status: 201,
    description: "Created a new Author",
    type: AuthorDto,
  })
  addAuthor(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    const author = new Author();
    author.firstName = createAuthorDto.firstName;
    author.lastName = createAuthorDto.lastName;
    return this.authorService.addOrUpdate(author);
  }
}

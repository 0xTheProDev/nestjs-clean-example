import { Author } from "@entities/author.entity";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthorService } from "@services/author.service";
import { AuthorDto, CreateAuthorDto, UpdateAuthorDto } from "@dtos/author.dto";
import { BookService } from "@services/book.service";
import { BookDto, CreateBookDto } from "@dtos/book.dto";
import { Book } from "@entities/book.entity";

@ApiTags("Author")
@Controller({ path: "authors", version: "1" })
export class AuthorController {
  constructor(
    private readonly authorService: AuthorService,
    private readonly bookService: BookService,
  ) {}

  @Get()
  @ApiOperation({ summary: "List all Authors" })
  @ApiOkResponse({
    description: "Found list of Authors",
    type: [AuthorDto],
  })
  getAuthors(): Promise<Author[]> {
    return this.authorService.findAll();
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get an Author by Id",
    parameters: [
      {
        description: "Unique Id of the Author",
        in: "path",
        name: "id",
        required: true,
      },
    ],
  })
  @ApiOkResponse({
    description: "Found existing Author",
    type: AuthorDto,
  })
  getAuthor(@Param("id") id: number): Promise<Author> {
    return this.authorService.findOne(id);
  }

  @Get(":id/books")
  @ApiOperation({
    summary: "Get all Books written by the Author with Id",
    parameters: [
      {
        description: "Unique Id of the Author",
        in: "path",
        name: "id",
        required: true,
      },
    ],
  })
  @ApiOkResponse({
    description: "List of all Books written by the Author",
    type: [BookDto],
  })
  async getBooks(@Param("id") id: number): Promise<Book[]> {
    const author = await this.authorService.findOne(id);
    return author.books;
  }

  @Post()
  @ApiOperation({ summary: "Create a new Author" })
  @ApiCreatedResponse({
    description: "Created a new Author",
    type: AuthorDto,
  })
  addAuthor(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    const author = new Author();
    author.firstName = createAuthorDto.firstName;
    author.lastName = createAuthorDto.lastName;
    return this.authorService.save(author);
  }

  @Post(":id/books")
  @ApiOperation({ summary: "Create a new Book by the Author" })
  @ApiCreatedResponse({
    description: "Created a new Book for the Author",
    type: BookDto,
  })
  addBook(
    @Param("id") id: number,
    @Body() createBookDto: CreateBookDto,
  ): Promise<Book> {
    const author = new Author();
    author.id = id;
    const book = new Book();
    book.name = createBookDto.name;
    book.authors = [author];
    return this.bookService.save(book);
  }

  @Put()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new Author if not already exist" })
  @ApiCreatedResponse({
    description: "Created or Updated an Author",
    type: AuthorDto,
  })
  addOrUpdateAuthor(@Body() createAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = new Author();
    author.id = createAuthorDto.id;
    author.firstName = createAuthorDto.firstName;
    author.lastName = createAuthorDto.lastName;
    return this.authorService.save(author);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.RESET_CONTENT)
  @ApiOperation({
    summary: "Updates an existing Author",
    parameters: [
      {
        description: "Unique Id of the Author",
        example: 1,
        in: "path",
        name: "id",
        required: true,
      },
    ],
  })
  @ApiResponse({
    description: "Updated Author",
    status: HttpStatus.RESET_CONTENT,
    type: AuthorDto,
  })
  updateAuthor(
    @Param("id") id: number,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    const author = new Author();
    author.firstName = updateAuthorDto.firstName;
    author.lastName = updateAuthorDto.lastName;
    return this.authorService.update(id, author);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete an Author by Id",
    parameters: [
      {
        description: "Unique Id of the Author",
        in: "path",
        name: "id",
        required: true,
      },
    ],
  })
  @ApiNoContentResponse({
    description: "Deleted existing Author",
    type: Boolean,
  })
  deleteAuthor(@Param("id") id: number): Promise<void> {
    return this.authorService.delete(id);
  }

  @Delete(":id/books/:bookId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Remove a Book from an Author",
    parameters: [
      {
        description: "Unique Id of the Author",
        in: "path",
        name: "id",
        required: true,
      },
      {
        description: "Unique Id of the Book",
        in: "path",
        name: "id",
        required: true,
      },
    ],
  })
  @ApiNoContentResponse({
    description: "Removed Book from the Author",
    type: Boolean,
  })
  async removeBook(
    @Param("id") id: number,
    @Param("bookId") bookId: number,
  ): Promise<void> {
    const author = await this.authorService.findOne(id);
    const books = (await author.books).filter((book) => book.id !== bookId);
    author.books = Promise.resolve(books);
    await this.authorService.save(author);
  }
}

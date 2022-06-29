import { Book } from "@entities/book.entity";
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
import { BookService } from "@services/book.service";
import { BookDto, CreateBookDto, UpdateBookDto } from "@dtos/book.dto";
import { Author } from "@entities/author.entity";
import { AddAuthorDto } from "@dtos/author.dto";

@ApiTags("Book")
@Controller({ path: "books", version: "1" })
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @ApiOperation({ summary: "List all Books" })
  @ApiOkResponse({
    description: "Found list of Books",
    type: [BookDto],
  })
  getBooks(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get a Book by Id",
    parameters: [
      {
        description: "Unique Id of the Book",
        in: "path",
        name: "id",
        required: true,
      },
    ],
  })
  @ApiOkResponse({
    description: "Found existing Book",
    type: BookDto,
  })
  getBook(@Param("id") id: number): Promise<Book> {
    return this.bookService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new Book" })
  @ApiCreatedResponse({
    description: "Created a new Book",
    type: BookDto,
  })
  addBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
    const book = new Book();
    book.name = createBookDto.name;
    return this.bookService.save(book);
  }

  @Post(":id/authors")
  @ApiOperation({ summary: "Add Author to an existing Book" })
  @ApiCreatedResponse({
    description: "Added Author to the Book",
    type: BookDto,
  })
  async addAuthor(
    @Param("id") id: number,
    @Body() addAuthorDto: AddAuthorDto,
  ): Promise<Book> {
    const author = new Author();
    author.id = addAuthorDto.id;
    const book = await this.bookService.findOne(id);
    book.authors = [...book.authors, author];
    return this.bookService.save(book);
  }

  @Put()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new Book if not already exist" })
  @ApiCreatedResponse({
    description: "Created or Updated an Book",
    type: BookDto,
  })
  addOrUpdateBook(@Body() createBookDto: UpdateBookDto): Promise<Book> {
    const book = new Book();
    book.id = createBookDto.id;
    book.name = createBookDto.name;
    return this.bookService.save(book);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.RESET_CONTENT)
  @ApiOperation({
    summary: "Updates an existing Book",
    parameters: [
      {
        description: "Unique Id of the Book",
        example: 1,
        in: "path",
        name: "id",
        required: true,
      },
    ],
  })
  @ApiResponse({
    description: "Updated Book",
    status: HttpStatus.RESET_CONTENT,
    type: BookDto,
  })
  updateBook(
    @Param("id") id: number,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    const book = new Book();
    book.name = updateBookDto.name;
    return this.bookService.update(id, book);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete a Book by Id",
    parameters: [
      {
        description: "Unique Id of the Book",
        in: "path",
        name: "id",
        required: true,
      },
    ],
  })
  @ApiNoContentResponse({
    description: "Deleted existing Book",
    type: Boolean,
  })
  deleteBook(@Param("id") id: number): Promise<void> {
    return this.bookService.delete(id);
  }

  @Delete(":id/authors/:authorId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Remove an Author from a Book",
    parameters: [
      {
        description: "Unique Id of the Book",
        in: "path",
        name: "id",
        required: true,
      },
      {
        description: "Unique Id of the Author",
        in: "path",
        name: "authorId",
        required: true,
      },
    ],
  })
  @ApiNoContentResponse({
    description: "Removed Author from existing Book",
    type: Boolean,
  })
  async removeAuthor(
    @Param("id") id: number,
    @Param("authorId") authorId: number,
  ): Promise<void> {
    const book = await this.bookService.findOne(id);
    book.authors = book.authors.filter((author) => author.id !== authorId);
    await this.bookService.save(book);
  }
}

import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  Book,
  CreateBookDto,
  DeleteBookDto,
  UpdateBookDto,
} from "@schemas/book.schema";
import { BookService } from "@services/book.service";
import { Book as BookModel } from "@entities/book.entity";

@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Query(() => [Book], { description: "List all Books" })
  async books() {
    return this.bookService.findAll();
  }

  @Query(() => Book, { description: "Get a Book by Id" })
  async book(@Args("id", { type: () => Int }) id: number) {
    return this.bookService.findOne(id);
  }

  @Mutation(() => Book, { description: "Create a new Book" })
  async createBook(@Args("book") createBookDto: CreateBookDto) {
    const book = new BookModel();
    book.name = createBookDto.name;
    return this.bookService.save(book);
  }

  @Mutation(() => Book, { description: "Updates an existing Book" })
  async updateBook(@Args("book") updateBookDto: UpdateBookDto) {
    const book = new BookModel();
    book.id = updateBookDto.id;
    book.name = updateBookDto.name;
    return this.bookService.save(book);
  }

  @Mutation(() => Boolean, { description: "Deletes an existing Book" })
  async deleteBook(@Args("book") deleteBookDto: DeleteBookDto) {
    await this.bookService.delete(deleteBookDto.id);
    return true;
  }
}

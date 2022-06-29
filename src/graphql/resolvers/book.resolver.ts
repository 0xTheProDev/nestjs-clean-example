import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { Book } from "@schemas/book.schema";
import { BookService } from "@services/book.service";

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
}

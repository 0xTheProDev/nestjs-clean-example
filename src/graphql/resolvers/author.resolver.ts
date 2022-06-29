import {
  Resolver,
  Args,
  Int,
  ResolveField,
  Parent,
  Query,
} from "@nestjs/graphql";
import { Author } from "@schemas/author.schema";
import { Book } from "@schemas/book.schema";
import { AuthorService } from "@services/author.service";

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private authorService: AuthorService) {}

  @Query(() => [Author], { description: "List all Authors" })
  async authors() {
    return this.authorService.findAll();
  }

  @Query(() => Author, { description: "Get an Author by Id" })
  async author(@Args("id", { type: () => Int }) id: number) {
    return this.authorService.findOne(id);
  }

  @ResolveField(() => [Book], {
    description: "List of all Books written by the Author",
  })
  async books(@Parent() author: Author) {
    return author.books;
  }
}

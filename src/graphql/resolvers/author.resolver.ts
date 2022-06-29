import {
  Resolver,
  Args,
  Int,
  ResolveField,
  Parent,
  Query,
  Mutation,
} from "@nestjs/graphql";
import { Author as AuthorModel } from "@entities/author.entity";
import { Book as BookModel } from "@entities/book.entity";
import {
  AddBookDto,
  Author,
  CreateAuthorDto,
  DeleteAuthorDto,
  UpdateAuthorDto,
} from "@schemas/author.schema";
import { Book } from "@schemas/book.schema";
import { AuthorService } from "@services/author.service";
import { BookService } from "@services/book.service";

@Resolver(() => Author)
export class AuthorResolver {
  constructor(
    private authorService: AuthorService,
    private readonly bookService: BookService,
  ) {}

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

  @Mutation(() => Author, { description: "Create a new Author" })
  async createAuthor(@Args("author") createAuthorDto: CreateAuthorDto) {
    const author = new AuthorModel();
    author.firstName = createAuthorDto.firstName;
    author.lastName = createAuthorDto.lastName;
    return this.authorService.save(author);
  }

  @Mutation(() => Author, { description: "Updates an existing Author" })
  async updateAuthor(@Args("author") updateAuthorDto: UpdateAuthorDto) {
    const author = new AuthorModel();
    author.id = updateAuthorDto.id;
    author.firstName = updateAuthorDto.firstName;
    author.lastName = updateAuthorDto.lastName;
    return this.authorService.save(author);
  }

  @Mutation(() => Boolean, { description: "Deletes an existing Author" })
  async deleteAuthor(@Args("author") deleteAuthorDto: DeleteAuthorDto) {
    await this.authorService.delete(deleteAuthorDto.id);
    return true;
  }

  @Mutation(() => Author, { description: "Add Book to Author" })
  async addBook(@Args("book") addBookDto: AddBookDto) {
    const author = new AuthorModel();
    author.id = addBookDto.authorId;
    const book = new BookModel();
    book.name = addBookDto.name;
    book.authors = [author];
    return this.bookService.save(book);
  }
}

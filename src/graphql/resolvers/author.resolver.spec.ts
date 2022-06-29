import { BookService } from "@services/book.service";
import { createMock } from "@golevelup/ts-jest";
import { AuthorResolver } from "./author.resolver";
import { plainToInstance } from "class-transformer";
import { AuthorService } from "@services/author.service";
import { Author as AuthorModel } from "@entities/author.entity";
import {
  AddBookDto,
  Author,
  CreateAuthorDto,
  DeleteAuthorDto,
  UpdateAuthorDto,
} from "@schemas/author.schema";
import { Book } from "@entities/book.entity";

describe("AuthorResolver", () => {
  let authorService: AuthorService;
  let bookService: BookService;
  let authorResolver: AuthorResolver;

  beforeEach(() => {
    authorService = createMock();
    bookService = createMock();
    authorResolver = new AuthorResolver(authorService, bookService);
  });

  describe("authors", () => {
    it("should return all the Authors", async () => {
      const authors = [
        plainToInstance(AuthorModel, {
          id: 1,
          firstName: "Makashi",
          lastName: "Kishimoto",
        }),
        plainToInstance(AuthorModel, {
          id: 2,
          firstName: "Hajime",
          lastName: "Isamaya",
        }),
      ];
      jest.spyOn(authorService, "findAll").mockResolvedValueOnce(authors);

      expect(await authorResolver.authors()).toEqual(authors);
    });
  });

  describe("author", () => {
    it("should return an Author with given id", async () => {
      const author = plainToInstance(AuthorModel, {
        id: 1,
        firstName: "Makashi",
        lastName: "Kishimoto",
      });
      jest.spyOn(authorService, "findOne").mockResolvedValueOnce(author);

      expect(await authorResolver.author(author.id)).toEqual(author);
    });
  });

  describe("books", () => {
    it("should return list of Books by parent Author", async () => {
      const books = [
        plainToInstance(Book, {
          id: 1,
          name: "Naruto",
        }),
      ];
      const author = plainToInstance(Author, {
        id: 1,
        firstName: "Makashi",
        lastName: "Kishimoto",
        books,
      });

      expect(await authorResolver.books(author)).toEqual(books);
    });
  });

  describe("createAuthor", () => {
    it("should return an Author with given name", async () => {
      const authorDto = plainToInstance(CreateAuthorDto, {
        firstName: "Makashi",
        lastName: "Kishimoto",
      });
      const author = plainToInstance(Author, {
        id: 1,
        firstName: "Makashi",
        lastName: "Kishimoto",
      });
      jest.spyOn(authorService, "save").mockImplementationOnce(async (dto) => ({
        id: author.id,
        ...dto,
      }));

      expect(await authorResolver.createAuthor(authorDto)).toEqual(author);
    });
  });

  describe("updateAuthor", () => {
    it("should return an Author with given id and name", async () => {
      const authorDto = plainToInstance(UpdateAuthorDto, {
        id: 1,
        firstName: "Hajime",
        lastName: "Isayama",
      });
      const author = plainToInstance(Author, {
        id: 1,
        firstName: "Hajime",
        lastName: "Isayama",
      });
      jest.spyOn(authorService, "save").mockImplementationOnce(async (dto) => ({
        id: author.id,
        ...dto,
      }));

      expect(await authorResolver.updateAuthor(authorDto)).toEqual(author);
    });
  });

  describe("deleteAuthor", () => {
    it("should delete an Author with given id", async () => {
      const authorDto = plainToInstance(DeleteAuthorDto, {
        id: 1,
      });
      const deleteSpy = jest
        .spyOn(authorService, "delete")
        .mockReturnValueOnce(undefined);

      await authorResolver.deleteAuthor(authorDto);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("addBook", () => {
    it("should add a Book to the Author", async () => {
      const bookDto = plainToInstance(AddBookDto, {
        authorId: 1,
        name: "Naruto",
      });
      const author = plainToInstance(AuthorModel, {
        id: 1,
        firstName: "Makashi",
        lastName: "Kishimoto",
      });
      const book = plainToInstance(Book, {
        id: 1,
        name: "Naruto",
        authors: [author],
      });
      jest.spyOn(bookService, "save").mockImplementationOnce(async (dto) => ({
        ...dto,
        id: book.id,
        authors: [author],
      }));

      expect(await authorResolver.addBook(bookDto)).toEqual(book);
    });
  });
});

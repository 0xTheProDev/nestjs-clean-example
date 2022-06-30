import { CreateAuthorDto, UpdateAuthorDto } from "@dtos/author.dto";
import { CreateBookDto } from "@dtos/book.dto";
import { Author } from "@entities/author.entity";
import { Book } from "@entities/book.entity";
import { AuthorService } from "@services/author.service";
import { BookService } from "@services/book.service";
import { plainToInstance } from "class-transformer";
import { createMock } from "@golevelup/ts-jest";

import { AuthorController } from "./author.controller";

describe("AuthorController", () => {
  let authorController: AuthorController;
  let authorService: AuthorService;
  let bookService: BookService;

  beforeEach(() => {
    authorService = createMock();
    bookService = createMock();
    authorController = new AuthorController(authorService, bookService);
  });

  describe("getAuthors", () => {
    it("should return an array of authors", async () => {
      const authors = [
        plainToInstance(Author, {
          id: 1,
          firstName: "Makashi",
          lastName: "Kishimoto",
        }),
        plainToInstance(Author, {
          id: 2,
          firstName: "Hajime",
          lastName: "Isamaya",
        }),
      ];
      jest.spyOn(authorService, "findAll").mockResolvedValueOnce(authors);

      expect(await authorController.getAuthors()).toEqual(authors);
    });
  });

  describe("getAuthor", () => {
    it("should return an author with id", async () => {
      const author = plainToInstance(Author, {
        id: 1,
        firstName: "Makashi",
        lastName: "Kishimoto",
      });
      jest.spyOn(authorService, "findOne").mockResolvedValueOnce(author);

      expect(await authorController.getAuthor(author.id)).toEqual(author);
    });
  });

  describe("getBooks", () => {
    it("should return array of books by the author with id", async () => {
      const books = [
        plainToInstance(Book, {
          id: 1,
          name: "Naruto",
        }),
        plainToInstance(Book, {
          id: 1,
          name: "Naruto Shipuden",
        }),
      ];
      const author = plainToInstance(Author, {
        id: 1,
        firstName: "Makashi",
        lastName: "Kishimoto",
        books,
      });
      jest.spyOn(authorService, "findOne").mockResolvedValueOnce(author);

      expect(await authorController.getBooks(author.id)).toEqual(author.books);
    });
  });

  describe("addAuthor", () => {
    it("should return an author with given name", async () => {
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

      expect(await authorController.addAuthor(authorDto)).toEqual(author);
    });
  });

  describe("addBook", () => {
    it("should return an author with given book", async () => {
      const bookDto = plainToInstance(CreateBookDto, {
        name: "Naruto",
      });
      const author = plainToInstance(Author, {
        id: 1,
        // firstName: "Makashi",
        // lastName: "Kishimoto",
      });
      const book = plainToInstance(Book, {
        id: 1,
        name: "Naruto",
        authors: [author],
      });

      jest.spyOn(bookService, "save").mockImplementationOnce(async (dto) => ({
        id: book.id,
        ...dto,
      }));

      expect(await authorController.addBook(author.id, bookDto)).toEqual(book);
    });
  });

  describe("addOrUpdateAuthor", () => {
    it("should return an author with given name and id", async () => {
      const authorDto = plainToInstance(UpdateAuthorDto, {
        id: 1,
        firstName: "Hajime",
        lastName: "Isamaya",
      });
      const author = plainToInstance(Author, {
        id: 1,
        firstName: "Makashi",
        lastName: "Kishimoto",
      });
      jest.spyOn(authorService, "save").mockImplementationOnce(async (dto) => ({
        ...author,
        ...dto,
      }));

      expect(await authorController.addOrUpdateAuthor(authorDto)).toEqual({
        ...author,
        ...authorDto,
      });
    });
  });

  describe("updateAuthor", () => {
    it("should return an author with given id and name", async () => {
      const authorDto = plainToInstance(UpdateAuthorDto, {
        firstName: "Hajime",
        lastName: "Isayama",
      });
      const author = plainToInstance(Author, {
        id: 1,
        firstName: "Hajime",
        lastName: "Isayama",
      });
      jest
        .spyOn(authorService, "update")
        .mockImplementationOnce(async (id, dto) => ({
          id,
          ...dto,
        }));

      expect(await authorController.updateAuthor(author.id, authorDto)).toEqual(
        author,
      );
    });
  });

  describe("deleteAuthor", () => {
    it("should delete an author with given id", async () => {
      const author = plainToInstance(Author, {
        id: 1,
        firstName: "Makashi",
        lastName: "Kishimoto",
      });
      const deleteSpy = jest
        .spyOn(authorService, "delete")
        .mockReturnValueOnce(undefined);

      await authorController.deleteAuthor(author.id);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("removeBook", () => {
    it("should delete a book from an author with given id", async () => {
      const book = plainToInstance(Book, {
        id: 1,
        name: "Naruto",
      });
      const author = plainToInstance(Author, {
        id: 1,
        firstName: "Makashi",
        lastName: "Kishimoto",
        books: [book],
      });
      jest.spyOn(authorService, "findOne").mockResolvedValueOnce(author);
      jest
        .spyOn(authorService, "save")
        .mockImplementationOnce(async (dto) => dto);

      await authorController.removeBook(author.id, book.id);
      expect(await author.books).toEqual([]);
    });
  });
});

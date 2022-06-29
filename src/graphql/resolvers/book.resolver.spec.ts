import { BookService } from "@services/book.service";
import { createMock } from "@golevelup/ts-jest";
import { BookResolver } from "./book.resolver";
import { plainToInstance } from "class-transformer";
import { Book } from "@entities/book.entity";
import {
  CreateBookDto,
  DeleteBookDto,
  UpdateBookDto,
} from "@schemas/book.schema";

describe("BookResolver", () => {
  let bookService: BookService;
  let bookResolver: BookResolver;

  beforeEach(() => {
    bookService = createMock();
    bookResolver = new BookResolver(bookService);
  });

  describe("books", () => {
    it("should return all the Books", async () => {
      const books = [
        plainToInstance(Book, {
          id: 1,
          name: "Naruto",
          authors: [],
        }),
        plainToInstance(Book, {
          id: 1,
          name: "Naruto Shipuden",
          authors: [],
        }),
      ];
      jest.spyOn(bookService, "findAll").mockResolvedValueOnce(books);

      expect(await bookResolver.books()).toEqual(books);
    });
  });

  describe("book", () => {
    it("should return a Book with given id", async () => {
      const book = plainToInstance(Book, {
        id: 1,
        name: "Naruto",
        authors: [],
      });
      jest.spyOn(bookService, "findOne").mockResolvedValueOnce(book);

      expect(await bookResolver.book(book.id)).toEqual(book);
    });
  });

  describe("createBook", () => {
    it("should return a Book with given name", async () => {
      const bookDto = plainToInstance(CreateBookDto, {
        name: "Naruto",
      });
      const book = plainToInstance(Book, {
        id: 1,
        name: "Naruto",
        authors: [],
      });

      jest.spyOn(bookService, "save").mockImplementationOnce(async (dto) => ({
        id: book.id,
        authors: [],
        ...dto,
      }));

      expect(await bookResolver.createBook(bookDto)).toEqual(book);
    });
  });

  describe("updateBook", () => {
    it("should return an book with given id and name", async () => {
      const bookDto = plainToInstance(UpdateBookDto, {
        id: 1,
        name: "Naruto",
      });
      const book = plainToInstance(Book, {
        id: 1,
        name: "Naruto",
        authors: [],
      });
      jest.spyOn(bookService, "save").mockImplementationOnce(async (dto) => ({
        id: book.id,
        authors: [],
        ...dto,
      }));

      expect(await bookResolver.updateBook(bookDto)).toEqual(book);
    });
  });

  describe("deleteBook", () => {
    it("should delete a Book with given id", async () => {
      const bookDto = plainToInstance(DeleteBookDto, {
        id: 1,
      });
      const deleteSpy = jest
        .spyOn(bookService, "delete")
        .mockReturnValueOnce(undefined);

      await bookResolver.deleteBook(bookDto);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });
  });
});

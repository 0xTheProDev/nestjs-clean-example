import { AddAuthorDto } from "@dtos/author.dto";
import { CreateBookDto, UpdateBookDto } from "@dtos/book.dto";
import { Author } from "@entities/author.entity";
import { Book } from "@entities/book.entity";
import { BookService } from "@services/book.service";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { BookController } from "./book.controller";

describe("BookController", () => {
  let bookController: BookController;
  let bookService: BookService;

  beforeEach(() => {
    bookService = new BookService(null as Repository<Book>);
    bookController = new BookController(bookService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getBooks", () => {
    it("should return an array of books", async () => {
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

      expect(await bookController.getBooks()).toEqual(books);
    });
  });

  describe("getBook", () => {
    it("should return an book with id", async () => {
      const book = plainToInstance(Book, {
        id: 1,
        name: "Naruto",
        authors: [],
      });
      jest.spyOn(bookService, "findOne").mockResolvedValueOnce(book);

      expect(await bookController.getBook(book.id)).toEqual(book);
    });
  });

  describe("addBook", () => {
    it("should return an book with given name", async () => {
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

      expect(await bookController.addBook(bookDto)).toEqual(book);
    });
  });

  describe("addAuthor", () => {
    it("should return an book with given author", async () => {
      const authorDto = plainToInstance(AddAuthorDto, {
        id: 1,
      });
      const author = plainToInstance(Author, {
        id: 1,
        // firstName: "Makashi",
        // lastName: "Kishimoto",
      });
      const book = plainToInstance(Book, {
        id: 1,
        name: "Naruto",
        authors: [],
      });
      jest.spyOn(bookService, "findOne").mockResolvedValueOnce(book);
      jest
        .spyOn(bookService, "save")
        .mockImplementationOnce(async (dto) => dto);

      expect(await bookController.addAuthor(book.id, authorDto)).toEqual({
        ...book,
        authors: [author],
      });
    });
  });

  describe("addOrUpdateBook", () => {
    it("should return an book with given name and id", async () => {
      const bookDto = plainToInstance(UpdateBookDto, {
        id: 1,
        name: "Naruto Shipuden",
      });
      const book = plainToInstance(Book, {
        id: 1,
        name: "Naruto",
        authors: [],
      });
      jest.spyOn(bookService, "save").mockImplementationOnce(async (dto) => ({
        ...book,
        ...dto,
      }));

      expect(await bookController.addOrUpdateBook(bookDto)).toEqual({
        ...book,
        ...bookDto,
      });
    });
  });

  describe("updateBook", () => {
    it("should return an book with given id and name", async () => {
      const bookDto = plainToInstance(UpdateBookDto, {
        name: "Naruto",
      });
      const book = plainToInstance(Book, {
        id: 1,
        name: "Naruto",
        authors: [],
      });
      jest
        .spyOn(bookService, "update")
        .mockImplementationOnce(async (id, dto) => ({
          id,
          authors: [],
          ...dto,
        }));

      expect(await bookController.updateBook(book.id, bookDto)).toEqual(book);
    });
  });

  describe("deleteBook", () => {
    it("should delete an book with given id", async () => {
      const book = plainToInstance(Book, {
        id: 1,
        name: "Naruto",
        authors: [],
      });
      const deleteSpy = jest
        .spyOn(bookService, "delete")
        .mockReturnValueOnce(undefined);

      await bookController.deleteBook(book.id);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("removeAuthor", () => {
    it("should delete a book from an author with given id", async () => {
      const author = plainToInstance(Author, {
        id: 1,
        firstName: "Makashi",
        lastName: "Kishimoto",
      });
      const book = plainToInstance(Book, {
        id: 1,
        name: "Naruto",
        authors: [author],
      });
      jest.spyOn(bookService, "findOne").mockResolvedValueOnce(book);
      const saveSpy = jest
        .spyOn(bookService, "save")
        .mockImplementationOnce(async (dto) => dto);

      await bookController.removeAuthor(book.id, author.id);
      expect(saveSpy).toHaveBeenCalledWith({
        ...book,
        authors: [],
      });
    });
  });
});

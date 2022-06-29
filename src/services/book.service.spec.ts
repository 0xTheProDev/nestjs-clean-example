import { Book } from "@entities/book.entity";
import { Repository } from "typeorm";
import { BookService } from "./book.service";
import { createMock } from "@golevelup/ts-jest";
import { plainToInstance } from "class-transformer";

describe("BookService", () => {
  let bookRepository: Repository<Book>;
  let bookService: BookService;

  beforeEach(() => {
    bookRepository = createMock();
    bookService = new BookService(bookRepository);
  });

  describe("delete", () => {
    it("should delete Book from Book Repository", async () => {
      const deleteSpy = jest
        .spyOn(bookRepository, "delete")
        .mockResolvedValueOnce(undefined);

      await bookService.delete(1);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("findAll", () => {
    it("should return all the Books in the Repository", async () => {
      const books = [
        plainToInstance(Book, {
          id: 1,
          name: "Naruto",
        }),
        plainToInstance(Book, {
          id: 2,
          name: "Naruto Shipuden",
        }),
      ];
      jest.spyOn(bookRepository, "find").mockResolvedValueOnce(books);

      expect(await bookService.findAll()).toEqual(books);
    });
  });

  describe("findOne", () => {
    it("should return one Book from the Repository by Id", async () => {
      const book = plainToInstance(Book, {
        id: 1,
        name: "Naruto",
      });
      jest.spyOn(bookRepository, "findOneBy").mockResolvedValueOnce(book);

      expect(await bookService.findOne(book.id)).toEqual(book);
    });
  });

  describe("save", () => {
    it("should add an Book to Repository", async () => {
      const bookData = plainToInstance(Book, {
        name: "Naruto",
      });
      const book = plainToInstance(Book, {
        id: 1,
        name: "Naruto",
      });
      jest.spyOn(bookRepository, "save").mockImplementationOnce(
        async (data) =>
          ({
            id: book.id,
            ...data,
          } as Book),
      );

      expect(await bookService.save(bookData)).toEqual(book);
    });
  });

  describe("update", () => {
    it("should update the Book in the Repository", async () => {
      const bookData = plainToInstance(Book, {
        name: "Naruto",
      });
      const book = plainToInstance(Book, {
        id: 1,
        name: "Naruto",
      });

      expect(await bookService.update(book.id, bookData)).toEqual(book);
    });
  });
});

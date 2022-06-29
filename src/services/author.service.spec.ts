import { Author } from "@entities/author.entity";
import { Repository } from "typeorm";
import { AuthorService } from "./author.service";
import { createMock } from "@golevelup/ts-jest";
import { plainToInstance } from "class-transformer";

describe("AuthorService", () => {
  let authorRepository: Repository<Author>;
  let authorService: AuthorService;

  beforeEach(() => {
    authorRepository = createMock();
    authorService = new AuthorService(authorRepository);
  });

  describe("delete", () => {
    it("should delete Author from Author Repository", async () => {
      const deleteSpy = jest
        .spyOn(authorRepository, "delete")
        .mockResolvedValueOnce(undefined);

      await authorService.delete(1);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("findAll", () => {
    it("should return all the Authors in the Repository", async () => {
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
      jest.spyOn(authorRepository, "find").mockResolvedValueOnce(authors);

      expect(await authorService.findAll()).toEqual(authors);
    });
  });

  describe("findOne", () => {
    it("should return one Author from the Repository by Id", async () => {
      const author = plainToInstance(Author, {
        id: 1,
        firstName: "Makashi",
        lastName: "Kishimoto",
      });
      jest.spyOn(authorRepository, "findOneBy").mockResolvedValueOnce(author);

      expect(await authorService.findOne(author.id)).toEqual(author);
    });
  });

  describe("save", () => {
    it("should add an Author to Repository", async () => {
      const authorData = plainToInstance(Author, {
        firstName: "Makashi",
        lastName: "Kishimoto",
      });
      const author = plainToInstance(Author, {
        id: 1,
        firstName: "Makashi",
        lastName: "Kishimoto",
      });
      jest.spyOn(authorRepository, "save").mockImplementationOnce(
        async (data) =>
          ({
            id: author.id,
            ...data,
          } as Author),
      );

      expect(await authorService.save(authorData)).toEqual(author);
    });
  });

  describe("update", () => {
    it("should update the Author in the Repository", async () => {
      const authorData = plainToInstance(Author, {
        firstName: "Makashi",
        lastName: "Kishimoto",
      });
      const author = plainToInstance(Author, {
        id: 1,
        firstName: "Makashi",
        lastName: "Kishimoto",
      });

      expect(await authorService.update(author.id, authorData)).toEqual(author);
    });
  });
});

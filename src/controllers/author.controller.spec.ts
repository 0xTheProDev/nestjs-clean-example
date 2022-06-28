import { Test, TestingModule } from "@nestjs/testing";
import { AuthorService } from "@services/author.service";

import { AuthorController } from "./author.controller";

describe("AuthorController", () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [AuthorService],
    }).compile();
  });

  describe("geAuthors", () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<AuthorController>(AuthorController);
      expect(appController.getAuthors()).toBe("Hello World!");
    });
  });
});

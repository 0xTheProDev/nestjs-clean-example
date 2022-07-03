import { faker } from "@faker-js/faker";
import { BookHttpModule } from "@modules/book-http.module";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Connection } from "typeorm";
import { createTestingModule } from "./setups/test-module";
import { createDatabaseOnce, seedDatabaseOnce } from "./setups/test-seeder";

describe("BookController (e2e)", () => {
  let app: NestFastifyApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleRef = await createTestingModule({
      imports: [BookHttpModule],
    }).compile();

    connection = await moduleRef.resolve(Connection);
    await createDatabaseOnce(connection);
    await seedDatabaseOnce(connection);

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/ (GET)", async () => {
    const result = await app.inject({
      method: "GET",
      url: "/books",
    });
    expect(result.statusCode).toEqual(200);
    expect(result.json()).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        }),
      ]),
    );
  });

  it("/:id (GET)", async () => {
    const bookId = faker.datatype.number({ min: 1, max: 30 });
    const result = await app.inject({
      method: "GET",
      url: `/books/${bookId}`,
    });
    expect(result.statusCode).toEqual(200);
    expect(result.json()).toStrictEqual(
      expect.objectContaining({
        id: bookId,
        name: expect.any(String),
      }),
    );
  });

  it("/ (POST)", async () => {
    const bookDto = {
      name: faker.commerce.productName(),
    };
    const result = await app.inject({
      method: "POST",
      url: "/books",
      payload: bookDto,
    });
    expect(result.statusCode).toEqual(201);
    expect(result.json()).toStrictEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: bookDto.name,
      }),
    );
  });

  it("/:id/authors (POST)", async () => {
    const bookId = faker.datatype.number({ min: 0, max: 30 });
    const authorDto = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };
    const result = await app.inject({
      method: "POST",
      url: `/books/${bookId}/authors`,
      payload: authorDto,
    });
    expect(result.statusCode).toEqual(201);
    expect(result.json()).toStrictEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
      }),
    );
  });

  it("/ (PUT)", async () => {
    const bookDto = {
      // Id would be selected non-deterministically at random - so either Add or Update
      id: faker.datatype.number({ min: 1, max: 45 }),
      name: faker.commerce.productName(),
    };
    const result = await app.inject({
      method: "PUT",
      url: "/books",
      payload: bookDto,
    });
    expect(result.statusCode).toEqual(201);
    expect(result.json()).toStrictEqual(
      expect.objectContaining({
        id: bookDto.id,
        name: bookDto.name,
      }),
    );
  });

  it("/:id (PATCH)", async () => {
    const bookDto = {
      id: faker.datatype.number({ min: 1, max: 30 }),
      name: faker.commerce.productName(),
    };
    const result = await app.inject({
      method: "PATCH",
      url: `/books/${bookDto.id}`,
      payload: bookDto,
    });
    expect(result.statusCode).toEqual(205);
    expect(result.json()).toStrictEqual(
      expect.objectContaining({
        id: `${bookDto.id}`,
        name: bookDto.name,
      }),
    );
  });

  it("/:id (DELETE)", async () => {
    const bookId = faker.datatype.number({ min: 0, max: 30 });
    const result = await app.inject({
      method: "DELETE",
      url: `/books/${bookId}`,
    });
    expect(result.statusCode).toEqual(204);
  });

  it("/:id/authors/:authorId (DELETE)", async () => {
    const authorId = faker.datatype.number({ min: 1, max: 10 });
    const bookId = faker.datatype.number({ min: 1, max: 30 });
    const result = await app.inject({
      method: "DELETE",
      url: `/books/${bookId}/authors/${authorId}`,
    });
    expect(result.statusCode).toEqual(204);
  });
});

import { faker } from "@faker-js/faker";
import { AuthorHttpModule } from "@modules/author-http.module";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Connection } from "typeorm";
import { extendExpect } from "./setups/test-e2e";
import { createTestingModule } from "./setups/test-module";
import { createDatabaseOnce, seedDatabaseOnce } from "./setups/test-seeder";

extendExpect();

describe("AuthorController (e2e)", () => {
  let app: NestFastifyApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleRef = await createTestingModule({
      imports: [AuthorHttpModule],
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
      url: "/authors",
    });
    expect(result.statusCode).toEqual(200);
    expect(result.json()).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
        }),
      ]),
    );
  });

  it("/:id (GET)", async () => {
    const authorId = faker.datatype.number({ min: 1, max: 10 });
    const result = await app.inject({
      method: "GET",
      url: `/authors/${authorId}`,
    });
    expect(result.statusCode).toEqual(200);
    expect(result.json()).toStrictEqual(
      expect.objectContaining({
        id: authorId,
        firstName: expect.any(String),
        lastName: expect.any(String),
      }),
    );
  });

  it("/:id/books (GET)", async () => {
    const authorId = faker.datatype.number({ min: 1, max: 10 });
    const result = await app.inject({
      method: "GET",
      url: `/authors/${authorId}/books`,
    });
    expect(result.statusCode).toEqual(200);
    expect(result.json()).toStrictEqual(
      expect.arrayContainingIfExists([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        }),
      ]),
    );
  });

  it("/ (POST)", async () => {
    const authorDto = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };
    const result = await app.inject({
      method: "POST",
      url: "/authors",
      payload: authorDto,
    });
    expect(result.statusCode).toEqual(201);
    expect(result.json()).toStrictEqual(
      expect.objectContaining({
        id: expect.any(Number),
        firstName: authorDto.firstName,
        lastName: authorDto.lastName,
      }),
    );
  });

  it("/:id/books (POST)", async () => {
    const authorId = faker.datatype.number({ min: 1, max: 10 });
    const bookDto = {
      name: faker.commerce.productName(),
    };
    const result = await app.inject({
      method: "POST",
      url: `/authors/${authorId}/books`,
      payload: bookDto,
    });
    expect(result.statusCode).toEqual(201);
    expect(result.json()).toStrictEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: bookDto.name,
        authors: [
          {
            id: `${authorId}`,
          },
        ],
      }),
    );
  });

  it("/ (PUT)", async () => {
    const authorDto = {
      // Id would be selected non-deterministically at random - so either Add or Update
      id: faker.datatype.number({ min: 1, max: 15 }),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };
    const result = await app.inject({
      method: "PUT",
      url: "/authors",
      payload: authorDto,
    });
    expect(result.statusCode).toEqual(201);
    expect(result.json()).toStrictEqual(
      expect.objectContaining({
        id: authorDto.id,
        firstName: authorDto.firstName,
        lastName: authorDto.lastName,
      }),
    );
  });

  it("/:id (PATCH)", async () => {
    const authorDto = {
      id: faker.datatype.number({ min: 1, max: 10 }),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };
    const result = await app.inject({
      method: "PATCH",
      url: `/authors/${authorDto.id}`,
      payload: authorDto,
    });
    expect(result.statusCode).toEqual(205);
    expect(result.json()).toStrictEqual(
      expect.objectContaining({
        id: `${authorDto.id}`,
        firstName: authorDto.firstName,
        lastName: authorDto.lastName,
      }),
    );
  });

  it("/:id (DELETE)", async () => {
    const result = await app.inject({
      method: "DELETE",
      url: "/authors/11", // Using Author Id that does not have a Book entry
    });
    expect(result.statusCode).toEqual(204);
  });

  it("/:id/books/:bookId (DELETE)", async () => {
    const authorId = faker.datatype.number({ min: 1, max: 10 });
    const bookId = faker.datatype.number({ min: 1, max: 30 });
    const result = await app.inject({
      method: "DELETE",
      url: `/authors/${authorId}/books/${bookId}`,
    });
    expect(result.statusCode).toEqual(204);
  });
});

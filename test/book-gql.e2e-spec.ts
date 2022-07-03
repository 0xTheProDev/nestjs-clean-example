import { faker } from "@faker-js/faker";
import { BookHttpModule } from "@modules/book-http.module";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Connection } from "typeorm";
import { createTestingModule } from "./setups/test-module";
import { createDatabaseOnce, seedDatabaseOnce } from "./setups/test-seeder";

describe("BookResolver (e2e)", () => {
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

  it("books (Query)", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: {
        query: `query {
          books {
            id,
            name,
          }
        }`,
      },
    });
    expect(result.statusCode).toEqual(200);
    expect(result.json().data).toStrictEqual(
      expect.objectContaining({
        books: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        ]),
      }),
    );
  });

  it("book (Query)", async () => {
    const bookId = faker.datatype.number({ min: 1, max: 10 });
    const result = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: {
        query: `query {
          book(id: ${bookId}) {
            id,
            name,
          }
        }`,
      },
    });
    expect(result.statusCode).toEqual(200);
    expect(result.json().data).toStrictEqual(
      expect.objectContaining({
        book: expect.objectContaining({
          id: bookId,
          name: expect.any(String),
        }),
      }),
    );
  });

  it("createBook (Mutation)", async () => {
    const bookDto = {
      name: faker.commerce.productName(),
    };
    const result = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: {
        query: `mutation createBook(
          $name: String!,
        ) {
          createBook(book: {
            name: $name,
          }) {
            id,
            name,
          }
        }`,
        variables: bookDto,
      },
    });
    expect(result.statusCode).toEqual(200);
    expect(result.json().data).toStrictEqual(
      expect.objectContaining({
        createBook: expect.objectContaining({
          id: expect.any(Number),
          name: bookDto.name,
        }),
      }),
    );
  });

  it("updateBook (Mutation)", async () => {
    const bookDto = {
      id: faker.datatype.number({ min: 1, max: 10 }),
      name: faker.commerce.productName(),
    };
    const result = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: {
        query: `mutation updateBook(
          $id: Int!,
          $name: String!,
        ) {
          updateBook(book: {
            id: $id,
            name: $name,
          }) {
            id,
            name,
          }
        }`,
        variables: bookDto,
      },
    });
    expect(result.statusCode).toEqual(200);
    expect(result.json().data).toStrictEqual(
      expect.objectContaining({
        updateBook: expect.objectContaining({
          id: bookDto.id,
          name: bookDto.name,
        }),
      }),
    );
  });

  it("deleteBook (Mutation)", async () => {
    const bookDto = {
      id: faker.datatype.number({ min: 0, max: 31 }),
    };
    const result = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: {
        query: `mutation deleteBook(
          $id: Int!
        ) {
          deleteBook(book: {
            id: $id,
          })
        }`,
        variables: bookDto,
      },
    });
    expect(result.statusCode).toEqual(200);
    expect(result.json().data).toStrictEqual(
      expect.objectContaining({
        deleteBook: true,
      }),
    );
  });
});

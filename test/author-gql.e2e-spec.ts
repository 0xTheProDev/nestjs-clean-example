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

describe("AuthorResolver (e2e)", () => {
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

  it("authors (Query)", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: {
        query: `query {
          authors {
            id,
            firstName,
            lastName
          }
        }`,
      },
    });
    expect(result.statusCode).toEqual(200);
    expect(result.json().data).toStrictEqual(
      expect.objectContaining({
        authors: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            firstName: expect.any(String),
            lastName: expect.any(String),
          }),
        ]),
      }),
    );
  });

  it("author (Query)", async () => {
    const authorId = faker.datatype.number({ min: 1, max: 10 });
    const result = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: {
        query: `query {
          author(id: ${authorId}) {
            id,
            firstName,
            lastName,
            books {
              id,
              name
            }
          }
        }`,
      },
    });
    expect(result.statusCode).toEqual(200);
    expect(result.json().data).toStrictEqual(
      expect.objectContaining({
        author: expect.objectContaining({
          id: authorId,
          firstName: expect.any(String),
          lastName: expect.any(String),
          books: expect.arrayContainingIfExists([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
            }),
          ]),
        }),
      }),
    );
  });

  it("createAuthor (Mutation)", async () => {
    const authorDto = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };
    const result = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: {
        query: `mutation createAuthor(
          $firstName: String!,
          $lastName: String!
        ) {
          createAuthor(author: {
            firstName: $firstName,
            lastName: $lastName
          }) {
            id,
            firstName,
            lastName
          }
        }`,
        variables: authorDto,
      },
    });
    expect(result.statusCode).toEqual(200);
    expect(result.json().data).toStrictEqual(
      expect.objectContaining({
        createAuthor: expect.objectContaining({
          id: expect.any(Number),
          firstName: authorDto.firstName,
          lastName: authorDto.lastName,
        }),
      }),
    );
  });

  it("updateAuthor (Mutation)", async () => {
    const authorDto = {
      id: faker.datatype.number({ min: 1, max: 10 }),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };
    const result = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: {
        query: `mutation updateAuthor(
          $id: Int!,
          $firstName: String!,
          $lastName: String!
        ) {
          updateAuthor(author: {
            id: $id,
            firstName: $firstName,
            lastName: $lastName
          }) {
            id,
            firstName,
            lastName
          }
        }`,
        variables: authorDto,
      },
    });
    expect(result.statusCode).toEqual(200);
    expect(result.json().data).toStrictEqual(
      expect.objectContaining({
        updateAuthor: expect.objectContaining({
          id: authorDto.id,
          firstName: authorDto.firstName,
          lastName: authorDto.lastName,
        }),
      }),
    );
  });

  it("deleteAuthor (Mutation)", async () => {
    const authorDto = {
      id: 11,
    };
    const result = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: {
        query: `mutation deleteAuthor(
          $id: Int!
        ) {
          deleteAuthor(author: {
            id: $id,
          })
        }`,
        variables: authorDto,
      },
    });
    expect(result.statusCode).toEqual(200);
    expect(result.json().data).toStrictEqual(
      expect.objectContaining({
        deleteAuthor: true,
      }),
    );
  });

  it("addBook (Mutation)", async () => {
    const bookDto = {
      authorId: faker.datatype.number({ min: 1, max: 10 }),
      name: faker.commerce.productName(),
    };
    const result = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: {
        query: `mutation addBook(
          $authorId: Int!,
          $name: String!,
        ) {
          addBook(book: {
            authorId: $authorId,
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
        addBook: expect.objectContaining({
          id: expect.any(Number),
          name: bookDto.name,
        }),
      }),
    );
  });
});

import { AuthorHttpModule } from "@modules/author-http.module";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Connection } from "typeorm";
import { createTestingModule } from "./setups/test-module";
import { seedDatabase } from "./setups/test-seeder";

describe("AuthorController (e2e)", () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await createTestingModule({
      imports: [AuthorHttpModule],
    }).compile();

    const connection = await moduleRef.resolve(Connection);
    await seedDatabase(connection);

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
  });
});

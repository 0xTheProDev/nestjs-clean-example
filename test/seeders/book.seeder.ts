import { Author } from "@entities/author.entity";
import { Book } from "@entities/book.entity";
import { faker } from "@faker-js/faker";
import { Factory, Seeder, times } from "@test-helpers/seeding";
import { Connection } from "typeorm";

export class CreateBooks implements Seeder {
  public async seed(factory: Factory, connection: Connection): Promise<any> {
    const em = connection.manager ?? connection.createEntityManager();

    await times(30, async () => {
      const book = await factory(Book)().create();
      const author = new Author();
      author.id = faker.datatype.number({ min: 1, max: 10 });
      book.authors = [author];

      return await em.save(book);
    });
  }
}

import { Author } from "@entities/author.entity";
import { Factory, Seeder } from "@test-helpers/seeding";

export class CreateAuthors implements Seeder {
  public async seed(factory: Factory): Promise<any> {
    await factory(Author)().createMany(10);
  }
}

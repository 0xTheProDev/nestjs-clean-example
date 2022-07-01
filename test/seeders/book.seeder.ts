import { Book } from "@entities/book.entity";
import { Factory, Seeder } from "@test-helpers/seeding";

export class CreateBooks implements Seeder {
  public async seed(factory: Factory): Promise<any> {
    await factory(Book)().createMany(10);
  }
}

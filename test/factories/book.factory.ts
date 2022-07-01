import { Book } from "@entities/book.entity";
import { Faker } from "@faker-js/faker";
import { define } from "@test-helpers/seeding";
import { plainToInstance } from "class-transformer";

define(Book, (faker: Faker) =>
  plainToInstance(Book, {
    name: faker.unique(faker.commerce.productName),
  }),
);

import { Author } from "@entities/author.entity";
import { Faker } from "@faker-js/faker";
import { define } from "@test-helpers/seeding";
import { plainToInstance } from "class-transformer";

define(Author, (faker: Faker) =>
  plainToInstance(Author, {
    id: faker.unique(faker.datatype.number),
    firstName: faker.unique(faker.name.firstName),
    lastName: faker.unique(faker.name.lastName),
  }),
);

import { Connection } from "typeorm";
import {
  importFiles,
  importSeed,
  loadFiles,
  runSeeder,
  SeederConstructor,
} from "@test-helpers/seeding";

/** Log Error in Console and Throw an Error for Test Runner to catch. */
const logError = (error: Error, message: string) => {
  console.log(error);
  // @ts-expect-error - Upcoming Feature in ES2022
  throw new Error(message, { cause: error });
};

/**
 * Seed Entities into Database for E2E Testing.
 */
export async function seedDatabase(connection: Connection) {
  const factoryFileLocation = ["test/factories/**/*{.ts,.js}"];
  const factoryFiles = loadFiles(factoryFileLocation);

  try {
    await importFiles(factoryFiles);
  } catch (error) {
    logError(error, "Could not import factories!");
  }

  const seederFileLocation = ["test/seeders/**/*{.ts,.js}"];
  const seederFiles = loadFiles(seederFileLocation);

  let seederFileObjects: SeederConstructor[] = [];
  try {
    seederFileObjects = await Promise.all(
      seederFiles.map((seederFile) => importSeed(seederFile)),
    );
  } catch (error) {
    logError(error, "Could not import seeders!");
  }

  for (const seederFileObject of seederFileObjects) {
    try {
      await runSeeder(seederFileObject, connection);
    } catch (error) {
      logError(error, `Could not run the seeder ${seederFileObject.name}!`);
    }
  }
}

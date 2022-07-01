import { Connection, ObjectType } from "typeorm";
import { EntityFactory } from "./entity-factory";
import { getNameOfEntity } from "./factory.utils";
import { importFiles, loadFiles } from "./file.utils";
import {
  FactoryBuilder,
  FactoryFunction,
  Seeder,
  SeederConstructor,
} from "./types";

/** Map of Entity Factories against Entity Key */
const entityFactories = new Map();

export const define = <Entity, Context>(
  entity: ObjectType<Entity>,
  factoryFn: FactoryFunction<Entity, Context>,
) => {
  entityFactories.set(getNameOfEntity(entity), {
    entity,
    factory: factoryFn,
  });
};

export const importSeed = async (
  filePath: string,
): Promise<SeederConstructor> => {
  const seedFileObject: { [key: string]: SeederConstructor } = await import(
    filePath
  );
  const keys = Object.keys(seedFileObject);
  return seedFileObject[keys[0]];
};

export const factory: FactoryBuilder =
  (connection: Connection) =>
  <Entity, Context>(entity: ObjectType<Entity>) =>
  (context?: Context) => {
    const name = getNameOfEntity(entity);
    const entityFactoryObject = entityFactories.get(name);
    return new EntityFactory<Entity, Context>(
      name,
      entity,
      entityFactoryObject.factory,
      connection,
      context,
    );
  };

export const runSeeder = async (
  clazz: SeederConstructor,
  connection: Connection,
): Promise<any> => {
  const seeder: Seeder = new clazz();
  return seeder.seed(factory(connection), connection);
};

export const useRefreshDatabase = async (
  connection: Connection,
): Promise<void> => {
  if (connection && connection.isConnected) {
    await connection.dropDatabase();
    await connection.synchronize();
  }
};

export const tearDownDatabase = async (
  connection: Connection,
): Promise<void> => {
  return connection && connection.isConnected ? connection.close() : undefined;
};

export const useSeeding = async (factories: string[]): Promise<void> => {
  const factoryFiles = loadFiles(factories);
  await importFiles(factoryFiles);
};

export { importFiles, loadFiles };

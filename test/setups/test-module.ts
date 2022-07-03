import { ApolloDriverConfig, ApolloDriver } from "@nestjs/apollo";
import { ModuleMetadata } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { Test, TestingModuleBuilder } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getTestDatabaseConfiguration } from "@test-helpers/database";

/**
 * @param metadata - Module Metadata.
 * @returns Testing Module builder to create Modules in Test.
 */
export function createTestingModule({
  imports,
  ...restOptions
}: ModuleMetadata): TestingModuleBuilder {
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ envFilePath: ".env.test", cache: true }),
      TypeOrmModule.forRoot(getTestDatabaseConfiguration()),
      GraphQLModule.forRoot<ApolloDriverConfig>({
        autoSchemaFile: true,
        debug: true,
        driver: ApolloDriver,
      }),
      ...imports,
    ],
    ...restOptions,
  });
}

import { TypeOrmModuleOptions } from "@nestjs/typeorm";

/**
 * @returns Configuration Object to connect with Test Database.
 */
export function getTestDatabaseConfiguration(): TypeOrmModuleOptions {
  return {
    type: "mysql",
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    username: process.env.DATABASE_USERNAME,
    autoLoadEntities: true,
    synchronize: true,
  };
}

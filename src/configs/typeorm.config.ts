import { Injectable } from "@nestjs/common";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "mysql",
      host: process.env.DATABASE_HOSTNAME,
      port: process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      username: process.env.DATABASE_USERNAME,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== "production",
    };
  }
}

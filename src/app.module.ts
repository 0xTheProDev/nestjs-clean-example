import { TypeOrmConfig } from "@configs/typeorm.config";
import { ApolloDriverConfig, ApolloDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthorHttpModule } from "@modules/author-http.module";
import { BookHttpModule } from "@modules/book-http.module";

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfig,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      debug: false,
      driver: ApolloDriver,
      sortSchema: true,
    }),
    AuthorHttpModule,
    BookHttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

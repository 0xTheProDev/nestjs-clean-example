import { TypeOrmConfig } from "@configs/typeorm.config";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthorHttpModule } from "./author-http.module";

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfig,
    }),
    AuthorHttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

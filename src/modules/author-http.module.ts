import { Module } from "@nestjs/common";
import { AuthorModule } from "./author.module";
import { AuthorService } from "@services/author.service";
import { AuthorController } from "@controllers/author.controller";
import { BookService } from "@services/book.service";
import { BookModule } from "./book.module";
import { AuthorsResolver } from "@resolvers/author.resolver";

@Module({
  imports: [AuthorModule, BookModule],
  providers: [AuthorService, BookService, AuthorsResolver],
  controllers: [AuthorController],
})
export class AuthorHttpModule {}

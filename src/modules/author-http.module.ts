import { Module } from "@nestjs/common";
import { AuthorModule } from "./author.module";
import { AuthorService } from "@services/author.service";
import { AuthorController } from "@controllers/author.controller";
import { BookService } from "@services/book.service";
import { BookModule } from "./book.module";
import { AuthorResolver } from "@resolvers/author.resolver";

@Module({
  imports: [AuthorModule, BookModule],
  providers: [AuthorService, BookService, AuthorResolver],
  controllers: [AuthorController],
})
export class AuthorHttpModule {}

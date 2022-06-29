import { Module } from "@nestjs/common";
import { BookModule } from "./book.module";
import { BookService } from "@services/book.service";
import { BookController } from "@controllers/book.controller";
import { BookResolver } from "@resolvers/book.resolver";

@Module({
  imports: [BookModule],
  providers: [BookService, BookResolver],
  controllers: [BookController],
})
export class BookHttpModule {}

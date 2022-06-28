import { Module } from "@nestjs/common";
import { BookModule } from "./book.module";
import { BookService } from "@services/book.service";
import { BookController } from "@controllers/book.controller";

@Module({
  imports: [BookModule],
  providers: [BookService],
  controllers: [BookController],
})
export class BookHttpModule {}

import { Book } from "@entities/book.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  exports: [TypeOrmModule],
})
export class BookModule {}

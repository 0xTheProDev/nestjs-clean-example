import { Author } from "@entities/author.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  exports: [TypeOrmModule],
})
export class AuthorModule {}

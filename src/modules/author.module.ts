import { AuthorController } from "@controllers/author.controller";
import { Author } from "@entities/author.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthorService } from "@services/author.service";

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  providers: [AuthorService],
  controllers: [AuthorController],
})
export class AuthorModule {}

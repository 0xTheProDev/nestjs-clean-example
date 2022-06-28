import { Module } from "@nestjs/common";
import { AuthorModule } from "./author.module";
import { AuthorService } from "@services/author.service";
import { AuthorController } from "@controllers/author.controller";

@Module({
  imports: [AuthorModule],
  providers: [AuthorService],
  controllers: [AuthorController],
})
export class AuthorHttpModule {}

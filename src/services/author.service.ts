import { Author } from "@entities/author.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  findAll(): Promise<Author[]> {
    return this.authorRepository.find();
  }

  findOne(id: number): Promise<Author> {
    return this.authorRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.authorRepository.delete(id);
  }
}

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

  async delete(id: number): Promise<void> {
    await this.authorRepository.delete(id);
  }

  findAll(): Promise<Author[]> {
    return this.authorRepository.find();
  }

  findOne(id: number): Promise<Author> {
    return this.authorRepository.findOneBy({ id });
  }

  save(author: Author): Promise<Author> {
    return this.authorRepository.save(author);
  }

  async update(id: number, author: Author): Promise<Author> {
    await this.authorRepository.update(id, author);
    return author;
  }
}

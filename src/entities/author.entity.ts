import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Book } from "./book.entity";

@Entity("authors")
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToMany(() => Book, (book) => book.authors, { cascade: true })
  books: Promise<Book[]>;
}

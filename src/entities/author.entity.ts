import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("authors")
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}

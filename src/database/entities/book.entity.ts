import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Borrow } from './borrow.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 250 })
  name: string;

  @Column()
  author: string;

  @Column()
  genre: string;

  @Column({ type: 'int' })
  copiesAvailable: number;

  @OneToMany(() => Borrow, (borrow) => borrow.book) borrow: Borrow[];
}

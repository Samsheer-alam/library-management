import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { User } from './user.entity';

export enum UserRole {
  ADMIN = 1,
  STUDENT = 2,
}
@Entity()
export class Borrow {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Book, (book) => book.borrow)
  book: Book;

  @ManyToOne(() => User, (user) => user.borrowedBooks)
  student: User;

  @ManyToOne(() => User, (user) => user.borrowAdmin)
  admin: User;

  @Column({ default: true })
  status: boolean;

  @Column()
  fromDate: Date;

  @Column()
  toDate: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

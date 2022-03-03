import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BorrowRepository } from '../database/repositories/borrow.repository';
import { BookRepository } from '../database/repositories/book.repository';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { UserRepository } from 'src/database/repositories/user.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      BookRepository,
      BorrowRepository,
      UserRepository,
    ]),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}

import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../database/entities/book.entity';
import { BookRepository } from 'src/database/repositories/book.repository';
import { User } from '../database/entities/user.entity';

import { BorrowRepository } from 'src/database/repositories/borrow.repository';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UserRepository } from 'src/database/repositories/user.repository';
import { RoleType } from 'src/shared/enum/role-type.enum';
import { getManager } from 'typeorm';
import { FilterBooksDto } from './dto/filter-books.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Borrow } from 'src/database/entities/borrow.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookRepository)
    private bookRepository: BookRepository,
    @InjectRepository(BorrowRepository)
    private borrowRepository: BorrowRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  addBook(createBookDto: CreateBookDto): Promise<Book> {
    return this.bookRepository.createBook(createBookDto);
  }

  getAllBooks(filterBookDto: FilterBooksDto): Promise<Pagination<Book>> {
    return this.bookRepository.getAllBooks(filterBookDto);
  }

  async getBookById(id: string): Promise<Book> {
    const found = await this.bookRepository.findOne(id);

    if (!found) {
      throw new NotFoundException('Book with given Id not found.');
    }
    return found;
  }

  async updateBookInfo(id: string, bookDto: CreateBookDto): Promise<Book> {
    const book = await this.getBookById(id);

    book.name = bookDto.name;
    book.author = bookDto.author;
    book.genre = bookDto.genre;
    book.copiesAvailable = bookDto.copiesAvailable;

    await this.bookRepository.save(book);
    return book;
  }

  async deleteBookById(id: string): Promise<void> {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Product with the given Id is not found.');
    }
  }

  async assignBookToStudent(
    borrowBookDto: BorrowBookDto,
    adminInfo: User,
  ): Promise<{ statusCode: number; message: string }> {
    const { bookId, studentId } = borrowBookDto;

    const bookInfo = await this.bookRepository.findOne({
      where: { id: bookId },
    });
    const studentInfo = await this.userRepository.findOne({
      where: { id: studentId },
    });

    //Check book is available to borrow
    if (!bookInfo || bookInfo.copiesAvailable === 0) {
      throw new NotFoundException('Book not available.');
    }

    //Check if given studentId exist or not
    if (!studentInfo || studentInfo.roleId !== RoleType.STUDENT) {
      throw new NotFoundException('Student not found.');
    }

    getManager()
      .transaction(async (con) => {
        // Assign book to student and update borrow table
        await con
          .getCustomRepository(BorrowRepository)
          .assignBookToStudent(borrowBookDto, studentInfo, bookInfo, adminInfo);

        //Reduce available copies of book from book table
        bookInfo.copiesAvailable = bookInfo.copiesAvailable - 1;
        await con.getCustomRepository(BookRepository).save(bookInfo);
      })
      .catch((e) => {
        console.log(e);
        throw new InternalServerErrorException();
      });

    return { statusCode: HttpStatus.CREATED, message: 'Successful' };
  }

  async fetchMyBooks(
    filterBookDto: FilterBooksDto,
    studentInfo: User,
  ): Promise<Promise<Pagination<Borrow>>> {
    return this.borrowRepository.getAllBorrowedBooks(
      filterBookDto,
      studentInfo,
    );
  }
}

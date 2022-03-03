import { EntityRepository, Repository } from 'typeorm';
import { BorrowBookDto } from 'src/book/dto/borrow-book.dto';
import { Borrow } from '../entities/borrow.entity';
import { User } from '../entities/user.entity';
import { Book } from '../entities/book.entity';
import { paginateRaw, Pagination } from 'nestjs-typeorm-paginate';
import { FilterBooksDto } from '../../book/dto/filter-books.dto';

@EntityRepository(Borrow)
export class BorrowRepository extends Repository<Borrow> {
  async assignBookToStudent(
    borrowBookDto: BorrowBookDto,
    student: User,
    book: Book,
    admin: User,
  ): Promise<any> {
    const { status, fromDate, toDate } = borrowBookDto;
    const borrow = this.create({
      admin,
      student,
      book,
      status,
      fromDate,
      toDate,
    });
    return await this.save(borrow);
  }

  async getAllBorrowedBooks(
    filterBookDto: FilterBooksDto,
    studentInfo: User,
  ): Promise<Pagination<Borrow>> {
    const { page, limit } = filterBookDto;

    const options = {
      page: page ? page : 1,
      limit: limit ? limit : 10,
    };
    const studentId = studentInfo.id;

    const queryBuilder = this.createQueryBuilder('borrow')
      .select([
        'borrow.id as borrowedId',
        'book.name as bookName',
        'book.author as author',
        'book.genre as genre ',
        'borrow.fromDate as borrowedOn',
        'borrow.toDate as returnDate',
      ])
      .where('borrow.student = :studentId', { studentId })
      .leftJoin('borrow.book', 'book')
      .orderBy('borrow.created_at', 'DESC');

    return await paginateRaw<Borrow>(queryBuilder, options);
  }
}

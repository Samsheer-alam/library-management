import { CreateBookDto } from '../../book/dto/create-book.dto';
import { EntityRepository, Like, Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { FilterBooksDto } from 'src/book/dto/filter-books.dto';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

@EntityRepository(Book)
export class BookRepository extends Repository<Book> {
  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const { name, author, genre, copiesAvailable } = createBookDto;
    const book = this.create({
      name,
      author,
      genre,
      copiesAvailable,
    });

    await this.save(book);
    return book;
  }

  async getAllBooks(filterBookDto: FilterBooksDto): Promise<Pagination<Book>> {
    const { name, author, genre, orderBy, orderType, page, limit } =
      filterBookDto;
    let where = {};

    if (name) where = { ...where, name: Like(`%${name}%`) };
    if (author) where = { ...where, author: Like(`%${author}%`) };
    if (genre) where = { ...where, genre: Like(`%${genre}%`) };

    const ordType = orderType ? orderType : 'DESC';
    const orderColumn = orderBy ? orderBy : 'id';

    const options = {
      page: page ? page : 1,
      limit: limit ? limit : 10,
    };
    return await paginate<Book>(this, options, {
      where,
      order: { [orderColumn]: ordType },
    });
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Book } from '../database/entities/book.entity';
import { Logger } from 'winston';
import { BookService } from './book.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from 'src/shared/enum/role-type.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { FilterBooksDto } from './dto/filter-books.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Borrow } from 'src/database/entities/borrow.entity';

@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post()
  addBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.bookService.addBook(createBookDto);
  }

  @Get()
  getAllBooks(
    @Query() filterBookDto: FilterBooksDto,
  ): Promise<Pagination<Book>> {
    this.logger.info('Calling getAllBooks()', {
      controller: BookController.name,
    });

    return this.bookService.getAllBooks(filterBookDto);
  }

  @Get('my-books')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.STUDENT)
  fetchMyBooks(
    @Query() filterBookDto: FilterBooksDto,
    @Request() req,
  ): Promise<Promise<Pagination<Borrow>>> {
    return this.bookService.fetchMyBooks(filterBookDto, req.user);
  }

  @Get(':id')
  getBookById(@Param('id') id: string): Promise<Book> {
    return this.bookService.getBookById(id);
  }

  @Put(':id')
  updateBookInfo(
    @Param('id') id: string,
    @Body() bookDto: CreateBookDto,
  ): Promise<Book> {
    return this.bookService.updateBookInfo(id, bookDto);
  }

  @Delete(':id')
  deleteBookById(@Param('id') id: string): Promise<void> {
    return this.bookService.deleteBookById(id);
  }

  @Post('assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  assignBookToStudent(
    @Request() req,
    @Body() borrowBookDto: BorrowBookDto,
  ): Promise<{ statusCode: number; message: string }> {
    return this.bookService.assignBookToStudent(borrowBookDto, req.user);
  }
}

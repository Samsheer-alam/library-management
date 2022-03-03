import { Test } from '@nestjs/testing';
import { UserRepository } from '../database/repositories/user.repository';
import { BookRepository } from '../database/repositories/book.repository';
import { BookService } from './book.service';
import { BorrowRepository } from '../database/repositories/borrow.repository';
import { FilterBooksDto } from './dto/filter-books.dto';

const mockBookRepository = () => ({
  getAllBooks: jest.fn(),
  findOne: jest.fn(),
});
const mockBorrowRepository = () => ({});
const mockUserRepository = () => ({});

describe('BookService', () => {
  let service: BookService;
  let bookRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: BookRepository,
          useFactory: mockBookRepository,
        },
        {
          provide: BorrowRepository,
          useFactory: mockBorrowRepository,
        },
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get(BookService);
    bookRepository = module.get(BookRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllBooks', () => {
    it('calls BookRepository.getAllBooks and returns the result', async () => {
      const getAllBookSpy = jest.spyOn(service, 'getAllBooks');
      const filterDto: FilterBooksDto = {};
      service.getAllBooks(filterDto);
      expect(getAllBookSpy).toHaveBeenCalledWith(filterDto);
    });
  });

  describe('getBookById', () => {
    it('call BookRepository.findOne and returns the result', async () => {
      const getBookByIdSpy = jest.spyOn(service, 'getBookById');
      const bookId = '51720cd8-c816-4768-b96e-fd20cb4a85b6';
      const mockBook = {
        id: '51720cd8-c816-4768-b96e-fd20cb4a85b6',
        name: 'Book Two',
        author: 'John Deo',
        genre: 'Action',
        copiesAvailable: 12,
      };

      bookRepository.findOne.mockResolvedValue(mockBook);
      const result = await service.getBookById(bookId);
      expect(getBookByIdSpy).toHaveBeenCalledWith(bookId);
      expect(result).toEqual(mockBook);
    });

    it('calls BookRepository.findOne and handles the error', async () => {
      const getBookByIdSpy = jest.spyOn(service, 'getBookById');
      bookRepository.findOne.mockResolvedValue(null);
      expect(service.getBookById('someId')).rejects.toThrow(
        'Book with given Id not found.',
      );
    });
  });
});

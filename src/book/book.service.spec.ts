import { Test } from '@nestjs/testing';
import { UserRepository } from '../database/repositories/user.repository';
import { BookRepository } from '../database/repositories/book.repository';
import { BookService } from './book.service';
import { BorrowRepository } from '../database/repositories/borrow.repository';

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
      expect(bookRepository.getAllBooks).not.toHaveBeenCalled();
      bookRepository.getAllBooks.mockResolvedValue('..som');
      const filterDto = {
        name: 'sample name',
      };
      const result = await service.getAllBooks(filterDto);
      expect(bookRepository.getAllBooks).toHaveBeenCalled();
      expect(result).toEqual('..som');
    });
  });

  describe('getBookById', () => {
    it('call BookRepository.findOne and returns the result', async () => {
      const mockBook = {
        id: '51720cd8-c816-4768-b96e-fd20cb4a85b6',
        name: 'Book Two',
        author: 'John Deo',
        genre: 'Action',
        copiesAvailable: 12,
      };

      bookRepository.findOne.mockResolvedValue(mockBook);
      const result = await service.getBookById('someId');
      expect(result).toEqual(mockBook);
    });

    it('calls BookRepository.findOne and handles the error', async () => {
      bookRepository.findOne.mockResolvedValue(null);
      expect(service.getBookById('someId')).rejects.toThrow(
        'Product not found.',
      );
    });
  });
});

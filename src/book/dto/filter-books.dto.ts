import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { OrderBy } from '../../shared/enum/orderby-type';

export class FilterBooksDto {
  @IsOptional()
  @IsNotEmpty({
    message: 'Book Name can not be empty',
  })
  name?: string;

  @IsOptional()
  @IsNotEmpty({
    message: 'Author can not be empty',
  })
  author?: string;

  @IsOptional()
  @IsNotEmpty({
    message: 'Genre can not be empty',
  })
  genre?: string;

  @IsOptional()
  @IsNotEmpty({
    message: 'Status can not be empty',
  })
  status?: boolean;

  @IsOptional()
  @IsNotEmpty({
    message: 'OrderBy can not be empty',
  })
  @IsEnum(['name', 'author', 'genre'])
  orderBy?: string;

  @IsOptional()
  @IsNotEmpty({
    message: 'OrderType can not be empty',
  })
  @IsEnum(OrderBy)
  orderType?: string;

  @IsOptional()
  @IsNotEmpty({
    message: 'Page can not be empty',
  })
  page?: number;

  @IsOptional()
  @IsNotEmpty({
    message: 'Genre can not be empty',
  })
  limit?: number;
}

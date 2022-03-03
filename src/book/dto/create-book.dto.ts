import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  genre: string;

  @IsNotEmpty()
  @IsNumber()
  copiesAvailable: number;
}

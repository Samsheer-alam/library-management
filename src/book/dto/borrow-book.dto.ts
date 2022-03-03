import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, MaxDate, MinDate } from 'class-validator';
import * as moment from 'moment';
export class BorrowBookDto {
  @IsNotEmpty()
  studentId: string;

  @IsNotEmpty()
  bookId: string;

  @IsNotEmpty()
  status: boolean;

  @Type(() => Date)
  @IsDate()
  @MinDate(new Date(moment().format('YYYY-MM-DD')), {
    message: 'from Date should be current date',
  })
  @MaxDate(new Date(moment().format('YYYY-MM-DD')), {
    message: 'from Date should be current date',
  })
  fromDate: Date;

  @Type(() => Date)
  @IsDate()
  @MinDate(new Date(moment().add(1, 'days').format('YYYY-MM-DD')), {
    message: `To date must be between ${moment()
      .add(1, 'days')
      .format('YYYY-MM-DD')} to ${moment()
      .add(10, 'days')
      .format('YYYY-MM-DD')} `,
  })
  @MaxDate(new Date(moment().add(10, 'days').format('YYYY-MM-DD')), {
    message: `To date must be between ${moment()
      .add(1, 'days')
      .format('YYYY-MM-DD')} to ${moment()
      .add(10, 'days')
      .format('YYYY-MM-DD')} `,
  })
  toDate: Date;
}

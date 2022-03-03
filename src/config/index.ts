import { Book } from '../database/entities/book.entity';
import { Borrow } from '../database/entities/borrow.entity';
import { User } from '../database/entities/user.entity';

export const config = () => ({
  port: Number(process.env.PORT),
  database: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Book, Borrow],
    synchronize: true,
  },
  jwtSecret: process.env.JWT_SECRET,
});

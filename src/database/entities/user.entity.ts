import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Borrow } from './borrow.entity';
import { RoleType } from '../../shared/enum/role-type.enum';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.STUDENT,
  })
  roleId: RoleType;

  @Column({ length: 250 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Borrow, (borrow) => borrow.student) borrowedBooks: Borrow[];
  @OneToMany(() => Borrow, (borrow) => borrow.admin) borrowAdmin: Borrow[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}

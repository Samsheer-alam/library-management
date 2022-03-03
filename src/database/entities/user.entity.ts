import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Borrow } from './borrow.entity';
import { RoleType } from 'src/shared/enum/role-type.enum';
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
}

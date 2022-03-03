import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../../admin/dto/create-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, roleId } = createUserDto;
    const user = this.create({
      name,
      email,
      password,
      roleId,
    });

    await this.save(user);
    return user;
  }
  async getAllUsers(condition: any): Promise<User[]> {
    return await this.find(condition);
  }
}

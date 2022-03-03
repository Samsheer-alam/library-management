import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('student')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  addStudent(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.addStudent(createUserDto);
  }

  @Get()
  getAllStudents(): Promise<User[]> {
    return this.userService.getAllStudents();
  }
}

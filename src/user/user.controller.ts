import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './types/user.type';
import { randomUUID } from 'crypto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findUser() {
    const mockUser: User = {
      id: randomUUID(),
      name: 'John',
    };
    return mockUser;
  }
}

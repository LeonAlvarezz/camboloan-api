import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUsername(): string {
    return 'Jack the Ripper';
  }
}

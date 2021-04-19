import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { verify } from 'argon2';
import { LoggedInUserDto } from './dto/logged-in-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async validateUser(
    email: string,
    password: string,
  ): Promise<LoggedInUserDto> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await verify(user.password, password))) {
      return null;
    }

    const { password: _removedPassword, ...userNoPassword } = user;
    return userNoPassword;
  }
}

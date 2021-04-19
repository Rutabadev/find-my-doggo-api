import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { LoggedInUserDto } from './dto/logged-in-user.dto';
import { JwtDto } from './dto/jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await verify(user.password, password))) {
      return null;
    }

    const { password: _removedPassword, ...userNoPassword } = user;
    return userNoPassword;
  }

  async login(user: User): Promise<LoggedInUserDto> {
    const payload: JwtDto = { sub: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

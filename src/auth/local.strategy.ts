import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoggedInUserDto } from './dto/logged-in-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<LoggedInUserDto> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw UnauthorizedException;
    }
    return user;
  }
}

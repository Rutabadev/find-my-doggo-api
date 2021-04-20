import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { JwtDto } from './dto/jwt.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as _ from 'lodash';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }
  async validate(payload: JwtDto): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findByEmail(payload.sub);
    return _.omit(user, 'password');
  }
}

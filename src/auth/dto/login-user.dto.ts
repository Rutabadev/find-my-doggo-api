import { PickType } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Column } from 'typeorm';
import { Length } from 'class-validator';

export class LoginUserDto extends PickType(User, [
  'email',
  'password',
] as const) {
  @Column()
  @Length(3)
  password: string;
}

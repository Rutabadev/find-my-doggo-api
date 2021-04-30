import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Column } from 'typeorm';
import { Length } from 'class-validator';

export class CreateUserDto extends PickType(User, ['name', 'email'] as const) {
  @Column()
  @Length(3)
  password: string;
}

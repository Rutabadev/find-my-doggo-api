import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Column } from 'typeorm';
import { Length } from 'class-validator';

export class CreateUserDto extends OmitType(User, ['id', 'roles'] as const) {
  @Column()
  @Length(3)
  password: string;
}

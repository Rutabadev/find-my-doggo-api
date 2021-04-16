import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Column } from 'typeorm';
import { Length } from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreateUserDto extends OmitType(User, ['id'] as const) {
  @Column()
  @Length(3)
  @Exclude()
  password: string;
}

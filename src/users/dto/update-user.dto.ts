import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Column } from 'typeorm';
import { Length } from 'class-validator';

export class UpdateUserDto extends OmitType(PartialType(User), ['roles']) {
  @Column()
  @Length(3)
  password: string;

  @Column()
  roles: string[];
}

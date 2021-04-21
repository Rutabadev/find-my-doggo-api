import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Column } from 'typeorm';
import { IsOptional, Length } from 'class-validator';

export class UpdateUserDto extends OmitType(PartialType(User), ['roles']) {
  @Column()
  @IsOptional()
  @Length(3)
  password?: string;

  @Column()
  roles: string[];
}

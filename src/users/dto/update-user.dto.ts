import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Column } from 'typeorm';
import { IsOptional, Length } from 'class-validator';

export class UpdateUserDto extends OmitType(PartialType(User), ['roles']) {
  @Column()
  @Length(3)
  @IsOptional()
  password?: string;

  @Column()
  @IsOptional()
  roles?: string[];
}

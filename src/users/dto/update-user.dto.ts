import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Column } from 'typeorm';
import { IsArray, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto extends OmitType(PartialType(User), ['roles']) {
  @Column()
  @Length(3)
  @IsOptional()
  password?: string;

  @Column()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}

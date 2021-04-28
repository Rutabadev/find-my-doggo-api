import { PickType } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { Length } from 'class-validator';
import { ChangePassword } from '../entities/change-password.entity';

export class ChangePasswordDto extends PickType(ChangePassword, ['uuid']) {
  @Column()
  @Length(3)
  password: string;
}

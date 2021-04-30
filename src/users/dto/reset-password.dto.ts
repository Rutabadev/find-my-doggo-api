import { Column } from 'typeorm';
import { Length } from 'class-validator';

export class ChangePasswordDto {
  @Column()
  uuid: string;

  @Column()
  @Length(3)
  password: string;
}

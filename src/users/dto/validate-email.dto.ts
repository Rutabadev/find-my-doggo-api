import { Column } from 'typeorm';

export class ValidateEmailDto {
  @Column()
  uuid: string;
}

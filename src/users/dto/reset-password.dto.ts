import { Column } from 'typeorm';
import { Allow, Length } from 'class-validator';

export class ChangePasswordDto {
  @Column()
  /**
   * This is a class-validator decorator to allow this field in payload,
   * otherwise it is remove by the whitelist = true option.
   */
  @Allow()
  uuid: string;

  @Column()
  @Length(3)
  password: string;
}

import { Column } from 'typeorm';
import { Allow } from 'class-validator';

export class ValidateEmailDto {
  @Column()
  /**
   * This is a class-validator decorator to allow this field in payload,
   * otherwise it is remove by the whitelist = true option.
   */
  @Allow()
  uuid: string;
}

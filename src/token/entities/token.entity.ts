import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Token {
  @PrimaryColumn()
  key: string;

  @Column()
  value: string;

  @CreateDateColumn()
  createdDate: Date;
}

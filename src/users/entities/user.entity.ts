import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { Role } from '../../roles/entities/role.entity';

@Entity()
export class User {
  constructor(partialUser: Partial<User>) {
    Object.assign(this, partialUser);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @Length(3)
  @Exclude({ toPlainOnly: true })
  @ApiHideProperty()
  password: string;

  @Column({ unique: true })
  @IsEmail()
  @ApiProperty({ format: 'email' })
  email: string;

  @Column({ default: false })
  emailValid: boolean;

  @ManyToMany(() => Role, { cascade: true, eager: true })
  @JoinTable()
  @Transform(({ value: roles }) => roles.map((role) => role.name))
  roles: Role[];
}

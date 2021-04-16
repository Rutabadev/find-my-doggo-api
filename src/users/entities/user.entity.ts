import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @Length(3)
  @Exclude()
  @ApiHideProperty()
  password: string;

  @Column({ unique: true })
  @IsEmail()
  @ApiProperty({ format: 'email' })
  email: string;
}

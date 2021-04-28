import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ChangePassword {
  @PrimaryColumn()
  uuid: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @CreateDateColumn()
  createdDate: Date;
}

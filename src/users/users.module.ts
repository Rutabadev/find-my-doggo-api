import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from '../roles/roles.module';
import { ChangePassword } from './entities/change-password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ChangePassword]), RolesModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

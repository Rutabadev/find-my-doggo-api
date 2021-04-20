import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);

    const userSameEmailExist = await this.userRepository.findOne({
      email: newUser.email,
    });
    if (userSameEmailExist) {
      throw new HttpException(
        'A user with the same email already exist',
        HttpStatus.CONFLICT,
      );
    }

    newUser.password = await hash(newUser.password);

    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password);
    }
    let user = await this.userRepository.findOne(id);
    const roles = await this.rolesService.findByStrings(updateUserDto.roles);
    user = { ...user, ...updateUserDto, roles };

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}

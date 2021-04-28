import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, LessThan, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePassword } from './entities/change-password.entity';
import { v4 as uuidv4 } from 'uuid';
import { CHANGE_PASSWORD_EXPIRATION } from './constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ChangePassword)
    private changePasswordRepository: Repository<ChangePassword>,
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

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async createChangePassword(user: User): Promise<string> {
    const uuid = uuidv4();
    await this.changePasswordRepository.save({
      user,
      uuid,
    });

    return uuid;
  }

  deleteChangePassword(uuid: string) {
    return this.changePasswordRepository.delete(uuid);
  }

  cleanChangePassword() {
    return this.changePasswordRepository.delete({
      createdDate: LessThan(new Date(Date.now() - CHANGE_PASSWORD_EXPIRATION)),
    });
  }

  async resetPassword(uuid: string, password: string) {
    const changePassword = await this.changePasswordRepository.findOne({
      where: { uuid },
    });
    if (!changePassword) {
      throw new HttpException(
        'This reset link is expired.',
        HttpStatus.BAD_REQUEST,
      );
    }
    changePassword.user.password = await hash(password);
    await this.userRepository.save(changePassword.user);
    await this.changePasswordRepository.delete(changePassword.uuid);
  }
}

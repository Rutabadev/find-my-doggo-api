import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenService } from '../token/token.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private tokenService: TokenService,
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

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async resetPassword(uuid: string, password: string) {
    const token = await this.tokenService.getToken(uuid);
    if (!token) {
      throw new HttpException(
        'This reset link is expired.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userRepository.findOne(token.value);
    if (!user) {
      throw new HttpException(
        'The user for this link does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    }
    user.password = await hash(password);
    await this.userRepository.save(user);
    await this.tokenService.deleteToken(uuid);
  }

  async validateEmail(uuid: string) {
    const token = await this.tokenService.getToken(uuid);
    if (!token) {
      throw new HttpException('This link is expired.', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findOne(token.value);
    if (!user) {
      throw new HttpException(
        'The user for this link does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    }
    user.emailValid = true;
    await this.userRepository.save(user);
    await this.tokenService.deleteToken(uuid);
  }
}

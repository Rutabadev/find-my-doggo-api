import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { RolesService } from '../roles/roles.service';
import { hash } from 'argon2';
import * as _ from 'lodash';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  /**
   * Sign up a new user.
   */
  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Request() { user: currentUser }: { user: User },
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (
      !_.map(currentUser.roles, 'name').includes('admin') &&
      currentUser.id.toString() !== id
    ) {
      throw new HttpException(
        "Can't update another user than yourself.",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password);
    }

    let user = await this.usersService.findById(id);

    let roles: Role[];
    if (updateUserDto.roles) {
      roles = await this.rolesService.findByStrings(updateUserDto.roles);
    }

    user = { ...user, ...updateUserDto, roles };

    try {
      await this.usersService.save(user);
    } catch (error) {
      throw new HttpException(error.detail, HttpStatus.BAD_REQUEST);
    }

    return this.usersService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

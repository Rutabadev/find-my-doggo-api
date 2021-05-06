import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { sendMail } from '../utils/sendMail';
import { ChangePasswordDto } from './dto/reset-password.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TOKEN_EXPIRATION } from '../token/constants';
import { singleButtonTemplate } from '../utils/mailTemplate';
import { TokenService } from '../token/token.service';
import { ValidateEmailDto } from './dto/validate-email.dto';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly tokenService: TokenService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  /**
   * Sign up a new user.
   */
  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const token = await this.tokenService.setToken(user.id.toString());
    const message = singleButtonTemplate(
      'Click this button to validate your email :',
      `https://find-doggo.herokuapp.com/validate-email/${token}`,
      'Validate',
    );
    sendMail(user.email, 'Validate your email', message);
    return user;
  }

  /**
   * Send an email to the user to reset password.
   */
  @Post('/forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);

    if (!user || !user.emailValid) {
      return;
    }

    // Check if a password reset has already been requested and is not yet expired
    const existingToken = this.tokenService.getTokenByValue(user.id.toString());
    if (existingToken) {
      return;
    }

    const token = await this.tokenService.setToken(user.id.toString());
    const message = singleButtonTemplate(
      'Click this button to reset your password :',
      `https://find-doggo.herokuapp.com/reset-password/${token}`,
      'Reset Password',
    );
    this.schedulerRegistry.addTimeout(
      `delete ${token}`,
      setTimeout(() => this.tokenService.deleteToken(token), TOKEN_EXPIRATION),
    );
    sendMail(forgotPasswordDto.email, 'Reset Password', message);
  }

  @Post('/reset-password')
  @HttpCode(204)
  async resetPassword(@Body() changePasswordDto: ChangePasswordDto) {
    await this.usersService.resetPassword(
      changePasswordDto.uuid,
      changePasswordDto.password,
    );
  }

  @Post('validate-email')
  @HttpCode(204)
  async validateEmail(@Body() validateEmailDto: ValidateEmailDto) {
    await this.usersService.validateEmail(validateEmailDto.uuid);
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

    user = new User({ ...user, ...updateUserDto, roles: roles ?? user.roles });

    try {
      await this.usersService.save(user);
    } catch (error) {
      throw new HttpException(error.detail, HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Request() { user: currentUser }: { user: User },
    @Param('id') id: string,
  ) {
    if (
      !_.map(currentUser.roles, 'name').includes('admin') &&
      currentUser.id.toString() !== id
    ) {
      throw new HttpException(
        "Can't delete another user than yourself.",
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.usersService.remove(id);
  }
}

import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { LoggedInUserDto } from './dto/logged-in-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Request() req,
  ): Promise<LoggedInUserDto> {
    return req.user;
  }
}

import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class ForgotPasswordDto extends PickType(User, ['email']) {}

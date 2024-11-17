import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { Public } from 'src/public.decorator';
import { AuthService } from './auth.service';
import { LoginWithEmailDto, LoginWithPhoneDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginWithEmailDto | LoginWithPhoneDto) {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('get-user')
  async getUser(@Request() req) {
    console.log('getuser id', req.user.id);
    return this.authService.getUserById(req.user.id);
  }

  @Get('create-admin')
  async createAdmin() {
    return this.authService.createAdmin();
  }

  @Public()
  @Get('forgot-password/:email')
  async forgotPassword(@Param('email') email: string) {
    return this.authService.sendPasswordResetEmail(email);
  }

  @Public()
  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, resetPasswordDto);
  }
}

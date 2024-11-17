import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LoginWithEmailDto, LoginWithPhoneDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordService } from './password/password.service';
import { EmailService } from '../email/email.service';
import { getEmailHTML } from './auth.template';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
    private mailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    // validate the password
    if (!this.passwordService.validatePassword(registerDto.password)) {
      throw new BadRequestException('Password is too weak');
    }

    // check if the email is already in use
    let user = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (user) {
      throw new ConflictException('Email is already in use');
    }

    // check if the phone number is already in use
    user = await this.prisma.user.findUnique({
      where: {
        phone: registerDto.phone,
      },
    });

    // the phone number may be already in use but the user is temporary (needs to complete registration)
    if (user) {
      throw new ConflictException('Phone number is already in use');
    }

    try {
      // hash the password
      const hashedPassword = await this.passwordService.hashPassword(
        registerDto.password,
      );

      user = await this.prisma.user.create({
        data: {
          full_name: registerDto.fullName,
          email: registerDto.email,
          phone: registerDto.phone,
          password_hash: hashedPassword,
        },
      });

      const { token, userData } = this.generateToken(user);

      return {
        token,
        user: userData,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException(
        'An error occurred while creating user',
      );
    }
  }

  async login(loginDto: LoginWithEmailDto | LoginWithPhoneDto) {
    if (loginDto.hasOwnProperty('email')) {
      return this.loginWithEmail(loginDto as LoginWithEmailDto);
    } else {
      return this.loginWithPhone(loginDto as LoginWithPhoneDto);
    }
  }

  async loginWithEmail(loginDto: LoginWithEmailDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const validPassword = await this.passwordService.comparePassword(
      password,
      user.password_hash,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { token, userData } = this.generateToken(user);

    return {
      token,
      user: userData,
    };
  }

  async loginWithPhone(loginDto: LoginWithPhoneDto) {
    const { phone, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const validPassword = await this.passwordService.comparePassword(
      password,
      user.password_hash,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const { token, userData } = this.generateToken(user);

    return {
      token,
      user: userData,
    };
  }

  async getUserById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          full_name: true,
          email: true,
          phone: true,
          role: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new InternalServerErrorException(
        'An error occurred while fetching user',
      );
    }
  }

  private generateToken(user: User) {
    const payload = { email: user.email, id: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token, userData: user };
  }

  async createAdmin() {
    try {
      const user = await this.prisma.user.create({
        data: {
          full_name: 'Admin',
          email: 'admin',
          phone: '0000000000',
          password_hash: await this.passwordService.hashPassword('admin'),
          role: 'ADMIN',
        },
      });

      const { token, userData } = this.generateToken(user);

      return {
        token,
        user: userData,
      };
    } catch (error) {
      console.error('Error creating admin:', error);
      throw new InternalServerErrorException(
        'An error occurred while creating admin',
      );
    }
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      const passwordResetToken = await this.prisma.passwordResetToken.create({
        data: {
          user_id: user.id,
        },
      });

      this.mailService.sendEmail(
        email,
        'Password Reset',
        getEmailHTML(
          `${process.env.FRONTEND_URL}/reset-password/${passwordResetToken.id}`,
        ),
      );
    }

    return {
      status: 'success',
      message:
        'A reset link will be sent to your email if it exists in our records.',
    };
  }

  async resetPassword(token: string, data: ResetPasswordDto) {
    const passwordResetToken = await this.prisma.passwordResetToken.findUnique({
      where: {
        id: token,
      },
    });

    if (!passwordResetToken) {
      throw new NotFoundException('Invalid token');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: passwordResetToken.user_id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      data.password,
    );

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password_hash: hashedPassword,
        },
      }),
      this.prisma.passwordResetToken.delete({
        where: {
          id: token,
        },
      }),
    ]);

    return {
      status: 'success',
      message: 'Password reset successful',
    };
  }
}

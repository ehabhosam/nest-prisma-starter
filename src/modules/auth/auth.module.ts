import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PasswordService } from './password/password.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { EmailModule } from '../email/email.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' },
    }),
    EmailModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}

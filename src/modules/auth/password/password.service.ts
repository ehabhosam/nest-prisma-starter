import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  validatePassword(password: string): boolean {
    return (
      password.length >= 8
      // /[A-Z]/.test(password) &&
      // /[a-z]/.test(password) &&
      // /[0-9]/.test(password)
    );
  }
}

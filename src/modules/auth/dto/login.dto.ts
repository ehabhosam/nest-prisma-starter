import { Email, Phone } from 'src/types';

export class LoginWithEmailDto {
  constructor(
    public password: string,
    public email: Email,
  ) {}
}
export class LoginWithPhoneDto {
  constructor(
    public password: string,
    public phone: Phone,
  ) {}
}

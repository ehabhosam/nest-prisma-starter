export class RegisterDto {
  constructor(
    public fullName: string,
    public email: string,
    public password: string,
    public phone: string,
  ) {}
}

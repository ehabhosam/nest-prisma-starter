import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, html: string) {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      html,
    });
  }
}

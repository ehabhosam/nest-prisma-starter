import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAdminHello(): string {
    return 'hello admin!';
  }

  getClientHello(): string {
    return 'hello client!';
  }

  getSellerHello(): string {
    return 'hello seller!';
  }
}

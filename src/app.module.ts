import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { ApiKeyGuard, RolesGuard } from './app.gaurd';
import { AppService } from './app.service';
import { AuthGuard } from './modules/auth/auth.gaurd';
import { AuthModule } from './modules/auth/auth.module';
import { ImageModule } from './modules/image/image.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [AuthModule, ImageModule, EmailModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

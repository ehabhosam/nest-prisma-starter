import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ImageController } from './image.controller';

@Module({
  imports: [CloudinaryModule],
  providers: [ImageService],
  controllers: [ImageController],
  exports: [ImageService],
})
export class ImageModule {}

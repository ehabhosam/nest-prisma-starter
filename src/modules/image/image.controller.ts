import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/types';
import { ImageService } from './image.service';
import { ImageValidationPipe } from './image.pipe';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Roles(Role.Admin)
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('file[]', 10))
  @UsePipes(ImageValidationPipe)
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    return this.imageService.uploadImages(files);
  }

  @Roles(Role.Client, Role.Admin)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ImageValidationPipe)
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.imageService.uploadSingleImage(file);
  }
}

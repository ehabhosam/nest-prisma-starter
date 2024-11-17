import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  private readonly MAX_SIZE = 3 * 1024 * 1024; // 3 MB in bytes

  async transform(files: Express.Multer.File | Express.Multer.File[]) {
    if (!files) {
      throw new BadRequestException('File(s) are missing');
    }

    if (Array.isArray(files)) {
      for (const file of files) {
        if (file.size > this.MAX_SIZE) {
          throw new PayloadTooLargeException(
            `File ${file.originalname} size exceeds the limit of 3MB`,
          );
        }
      }
    } else {
      if (files.size > this.MAX_SIZE) {
        throw new PayloadTooLargeException(
          'File size exceeds the limit of 3MB',
        );
      }
    }

    return files;
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ImageService {
  constructor(private readonly cloudinry: CloudinaryService) {}

  async uploadImage(file: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const image = await this.cloudinry.uploadImage(file);
    return image;
  }

  async uploadImages(files: Express.Multer.File[]) {
    const images = await Promise.all(
      files.map(async (file) => {
        return await this.cloudinry.uploadImage(file);
      }),
    );
    return images;
  }

  async deleteImage(imagePublicUrl: string) {
    if (imagePublicUrl.endsWith('/')) {
      imagePublicUrl = imagePublicUrl.slice(0, -1);
      console.log('modified imagePublicUrl: ', imagePublicUrl);
    }

    const publicId = imagePublicUrl.split('/').pop();

    return await this.cloudinry.deleteImage(publicId);
  }

  async uploadSingleImage(file: Express.Multer.File) {
    const url = await this.uploadImage(file);
    return {
      message: 'Image uploaded successfully',
      url,
    };
  }
}

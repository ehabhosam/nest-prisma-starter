import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<string | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result.url);
      });

      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteImage(publicId: string): Promise<UploadApiResponse> {
    return v2.uploader.destroy(publicId);
  }

  async uploadPdf(
    file: Express.Multer.File,
  ): Promise<string | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'pdfs',
          use_filename: true,
          format: 'pdf',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.url);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async deletePdf(publicId: string): Promise<void> {
    try {
      await v2.uploader.destroy('pdfs/' + publicId, { resource_type: 'raw' });
    } catch (error) {
      console.error('error deleting pdf', error);
    }
  }
}

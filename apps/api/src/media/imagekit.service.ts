import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';

@Injectable()
export class ImageKitService {
  private readonly logger = new Logger(ImageKitService.name);
  private readonly imagekit: ImageKit;

  constructor(private readonly configService: ConfigService) {
    const publicKey = this.configService.get<string>('IMAGEKIT_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('IMAGEKIT_PRIVATE_KEY');
    const urlEndpoint = this.configService.get<string>('IMAGEKIT_URL_ENDPOINT');

    if (!publicKey || !privateKey || !urlEndpoint) {
      throw new InternalServerErrorException(
        'ImageKit environment credentials (IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT) are required.',
      );
    }

    try {
      this.imagekit = new ImageKit({
        publicKey,
        privateKey,
        urlEndpoint,
      });
      this.logger.log('ImageKit SDK initialized successfully.');
    } catch (err) {
      this.logger.error('Failed to initialize ImageKit client SDK:', err);
      throw new InternalServerErrorException('Failed to initialize ImageKit SDK.');
    }
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    folderPath: string,
  ): Promise<{ url: string; fileId: string; key: string }> {
    try {
      const uploadResponse = await this.imagekit.upload({
        file: fileBuffer,
        fileName,
        folder: folderPath,
      });

      return {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        key: uploadResponse.filePath, // e.g. "PORTL/65c8f.../notices/doc.pdf"
      };
    } catch (error) {
      this.logger.error(`ImageKit upload failure for file ${fileName}:`, error);
      throw new InternalServerErrorException(`ImageKit upload failed: ${(error as Error).message}`);
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.imagekit.deleteFile(fileId);
    } catch (error) {
      this.logger.error(`ImageKit deletion failure for file ID ${fileId}:`, error);
      throw new InternalServerErrorException(`ImageKit deletion failed: ${(error as Error).message}`);
    }
  }
}

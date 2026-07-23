import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaRepository } from './media.repository';
import { ImageKitService } from './imagekit.service';
import { MediaDocument, Media } from './entities/media.entity';
import { UploadMediaDto } from './dto/upload-media.dto';
import { EntityType } from '@repo/schema';

@Injectable()
export class MediaService {
  constructor(
    private readonly repository: MediaRepository,
    private readonly imageKitService: ImageKitService,
  ) { }

  private getStorageFolder(societyId: string, entityType: string): string {
    const folder = entityType.toLowerCase().trim();
    const id = societyId.trim();
    return `PORTL/${id}/${folder}`;
  }

  async uploadMedia(
    file: Express.Multer.File,
    societyId: string,
    userId: string,
    dto: UploadMediaDto,
  ): Promise<MediaDocument> {
    const folderPath = this.getStorageFolder(societyId, dto.entityType);

    // Upload physical file to ImageKit
    const uploadResult = await this.imageKitService.uploadFile(
      file.buffer,
      file.originalname,
      folderPath,
    );

    let parsedMetadata = undefined;
    if (dto.metadata) {
      try {
        parsedMetadata = JSON.parse(dto.metadata);
      } catch (err) {
        // Fallback silently if metadata is invalid JSON
      }
    }

    const data: Partial<Media> = {
      societyId,
      uploadedBy: userId,
      url: uploadResult.url,
      key: uploadResult.key, // ImageKit file path/key
      fileName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      purpose: dto.purpose,
      entityType: dto.entityType,
      entityId: dto.entityId,
      metadata: parsedMetadata,
    };

    return this.repository.create(data);
  }

  async findOne(mediaId: string): Promise<MediaDocument> {
    const media = await this.repository.findOne(mediaId);
    if (!media) {
      throw new NotFoundException(`Media attachment with ID "${mediaId}" not found`);
    }
    return media;
  }

  async findByEntity(
    societyId: string,
    entityType: EntityType,
    entityId: string,
  ): Promise<MediaDocument[]> {
    return this.repository.find({ societyId, entityType, entityId });
  }

  async deleteMedia(mediaId: string): Promise<void> {
    const media = await this.findOne(mediaId);

    // Delete file from ImageKit
    await this.imageKitService.deleteFile(media.key);

    await this.repository.delete(mediaId);
  }
}

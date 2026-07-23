import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiUploadMedia, ApiGetMedia, ApiGetMediaList, ApiDeleteMedia } from './media.docs';
import { UploadMediaDto } from './dto/upload-media.dto';
import { EntityType } from '@repo/schema';

@ApiTags('media')
@Controller('media')
@UseGuards(JwtGuard)
export class MediaController {
  constructor(private readonly service: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiUploadMedia()
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('societyId') societyId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: UploadMediaDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required for upload');
    }
    const media = await this.service.uploadMedia(
      file,
      societyId,
      userId,
      dto,
    );
    return {
      success: true,
      message: 'File uploaded successfully',
      data: media,
    };
  }

  @Get(':mediaId')
  @ApiGetMedia()
  async findOne(@Param('mediaId') mediaId: string) {
    const media = await this.service.findOne(mediaId);
    return {
      success: true,
      message: 'Media retrieved successfully',
      data: media,
    };
  }

  @Get()
  @ApiGetMediaList()
  async findByEntity(
    @CurrentUser('societyId') societyId: string,
    @Query('entityType') entityType: EntityType,
    @Query('entityId') entityId: string,
  ) {
    const data = await this.service.findByEntity(societyId, entityType, entityId);
    return {
      success: true,
      message: 'Media attachments retrieved successfully',
      data,
    };
  }

  @Delete(':mediaId')
  @ApiDeleteMedia()
  async remove(@Param('mediaId') mediaId: string) {
    await this.service.deleteMedia(mediaId);
    return {
      success: true,
      message: 'Media attachment deleted successfully',
    };
  }
}

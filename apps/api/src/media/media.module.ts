import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Media, MediaSchema } from './entities/media.entity';
import { MediaRepository } from './media.repository';
import { ImageKitService } from './imagekit.service';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TokenModule } from '../shared/token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
    ConfigModule,
    TokenModule,
  ],
  controllers: [MediaController],
  providers: [MediaRepository, ImageKitService, MediaService],
  exports: [MediaService],
})
export class MediaModule {}

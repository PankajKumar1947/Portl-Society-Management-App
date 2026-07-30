import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Media, MediaDocument } from './entities/media.entity';

@Injectable()
export class MediaRepository {
  constructor(
    @InjectModel(Media.name)
    public readonly model: Model<MediaDocument>,
  ) {}

  async create(data: Partial<Media>): Promise<MediaDocument> {
    const created = new this.model(data);
    return created.save();
  }

  async find(filter: Record<string, unknown>): Promise<MediaDocument[]> {
    return this.model.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(mediaId: string): Promise<MediaDocument | null> {
    return this.model.findById(mediaId).exec();
  }

  async update(mediaId: string, data: Partial<Media>): Promise<MediaDocument | null> {
    return this.model.findByIdAndUpdate(mediaId, data, { returnDocument: 'after' }).exec();
  }

  async delete(mediaId: string): Promise<MediaDocument | null> {
    return this.model.findByIdAndDelete(mediaId).exec();
  }
}

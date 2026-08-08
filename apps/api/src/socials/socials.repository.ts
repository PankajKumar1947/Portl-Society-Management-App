import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './entities/post.entity';

@Injectable()
export class SocialsRepository {
  constructor(
    @InjectModel(Post.name)
    public readonly model: Model<PostDocument>,
  ) {}

  async create(data: Partial<Post>): Promise<PostDocument> {
    const created = new this.model(data);
    return created.save();
  }

  async find(filter: Record<string, unknown>): Promise<PostDocument[]> {
    return this.model
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<PostDocument | null> {
    return this.model.findOne({ id }).exec();
  }

  async save(post: PostDocument): Promise<PostDocument> {
    return post.save();
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as crypto from 'crypto';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class CommentModel {
  @Prop({ required: true, default: () => `cmt_${crypto.randomBytes(10).toString('hex')}` })
  id!: string;

  @Prop({ required: true })
  createdBy!: string; // userId

  @Prop({ required: true })
  content!: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(CommentModel);

@Schema({ timestamps: true })
export class Post {
  @Prop({
    required: true,
    unique: true,
    default: () => `post_${crypto.randomBytes(10).toString('hex')}`,
  })
  id!: string;

  @Prop({ required: true, index: true })
  societyId!: string;

  @Prop({ required: true, index: true })
  createdBy!: string; // userId

  @Prop({ required: true })
  content!: string;

  @Prop({ type: [String], default: [] })
  images!: string[];

  @Prop({ type: [String], default: [] })
  likedBy!: string[]; // array of userIds who liked the post

  @Prop({ type: [CommentSchema], default: [] })
  comments!: CommentModel[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

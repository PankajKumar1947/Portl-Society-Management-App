import { createZodDto } from 'nestjs-zod';
import { createPostSchema, createCommentSchema } from '@repo/schema';

export class CreatePostDto extends createZodDto(createPostSchema) {
  content!: string;
  images!: string[];
}

export class CreateCommentDto extends createZodDto(createCommentSchema) {
  content!: string;
}

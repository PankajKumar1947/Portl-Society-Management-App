import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodValidationPipe as NestJsZodValidationPipe } from 'nestjs-zod';

interface ValidationError {
  path: string | string[];
  message: string;
}

interface ErrorResponse {
  errors?: ValidationError[];
  message?: string;
  statusCode?: number;
}

export class ZodValidationPipe
  extends NestJsZodValidationPipe
  implements PipeTransform
{
  async transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      return (await super.transform(value, metadata)) as unknown;
    } catch (error) {
      if (error instanceof BadRequestException) {
        const response = error.getResponse() as ErrorResponse;

        // Check if it's a Zod validation error with errors array
        if (response.errors && Array.isArray(response.errors)) {
          // Transform to our custom clean format
          const errors = response.errors.map((err) => ({
            field: Array.isArray(err.path) ? err.path.join('.') : err.path,
            message: err.message,
          }));

          throw new BadRequestException({
            message: 'Validation failed',
            errors,
          });
        }
      }

      throw error;
    }
  }
}

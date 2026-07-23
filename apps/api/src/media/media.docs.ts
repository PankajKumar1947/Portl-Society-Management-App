import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MEDIA_PURPOSES, ENTITY_TYPES } from '@repo/schema';

export function ApiUploadMedia() {
  return applyDecorators(
    ApiOperation({ summary: 'Upload file to cloud storage and log media details' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
          purpose: {
            type: 'string',
            enum: [...MEDIA_PURPOSES],
            description: 'Media Purpose type',
          },
          entityType: {
            type: 'string',
            enum: [...ENTITY_TYPES],
            description: 'Associated parent entity type',
          },
          entityId: { type: 'string' },
          metadata: { type: 'string', description: 'JSON stringified extra metadata options' },
        },
        required: ['file', 'purpose', 'entityType'],
      },
    }),
    ApiResponse({ status: 201, description: 'File uploaded successfully' }),
  );
}

export function ApiGetMedia() {
  return applyDecorators(
    ApiOperation({ summary: 'Get details of a specific uploaded media attachment' }),
    ApiResponse({ status: 200, description: 'Media details retrieved' }),
  );
}

export function ApiGetMediaList() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all media documents matching entity reference query' }),
    ApiResponse({ status: 200, description: 'List of matching media details' }),
  );
}

export function ApiDeleteMedia() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete file from cloud storage and database metadata' }),
    ApiResponse({ status: 200, description: 'Media deleted successfully' }),
  );
}

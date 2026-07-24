import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export function ApiGetAcl() {
  return applyDecorators(
    ApiOperation({ summary: 'Get access control list for current user' }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'ACL fetched successfully.',
      schema: {
        example: {
          success: true,
          message: 'ACL fetched successfully',
          data: {
            role: 'RESIDENTS',
            resources: {
              residents: { view: true, create: false, update: false, delete: false },
              familyMembers: { view: true, create: true, update: false, delete: false },
              guards: { view: false, create: false, update: false, delete: false },
              society: { view: true, create: false, update: false, delete: false },
              towers: { view: false, create: false, update: false, delete: false },
              flats: { view: false, create: false, update: false, delete: false },
              amenities: { view: true, create: false, update: false, delete: false },
              notices: { view: true, create: false, update: false, delete: false },
              polls: { view: true, create: false, update: false, delete: false },
              complaints: { view: true, create: true, update: false, delete: false },
              helpdeskTickets: { view: true, create: true, update: false, delete: false },
              media: { view: true, create: true, update: false, delete: true },
              users: { view: true, create: false, update: false, delete: false },
            },
          },
        },
      },
    }),
  );
}

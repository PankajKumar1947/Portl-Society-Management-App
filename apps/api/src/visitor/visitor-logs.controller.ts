import {
  Controller,
  Get,
  UseGuards,
  UsePipes,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VisitorService } from './visitor.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { UserRoles, UserRole } from '@repo/schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('visitor-logs')
@Controller('visitor-logs')
@UseGuards(JwtGuard, RolesGuard, TenantGuard)
@UsePipes(new ZodValidationPipe())
export class VisitorLogsController {
  constructor(private readonly service: VisitorService) {}

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  async findAll(
    @CurrentUser('societyId') societyId: string,
    @CurrentUser('role') role: UserRole,
    @CurrentUser('userId') userId: string,
    @Query('search') search?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('direction') direction?: string,
  ) {
    const data = await this.service.findAllLogs(societyId, role, userId, { search, dateFrom, dateTo, direction });
    return {
      success: true,
      message: 'Visitor logs retrieved successfully',
      data,
    };
  }
}

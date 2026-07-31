import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorStatusDto } from './dto/update-status.dto';
import { RequestEntryDto } from './dto/request-entry.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { UserRoles, UserRole } from '@repo/schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  ApiCreateVisitor,
  ApiGetVisitors,
  ApiGetVisitor,
  ApiUpdateVisitorStatus,
  ApiScanPassCode,
} from './visitor.docs';

@ApiTags('visitors')
@Controller('visitors')
@UseGuards(JwtGuard, RolesGuard, TenantGuard)
@UsePipes(new ZodValidationPipe())
export class VisitorController {
  constructor(private readonly service: VisitorService) {}

  @Post()
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiCreateVisitor()
  async create(
    @Body() dto: CreateVisitorDto,
    @CurrentUser('societyId') societyId: string,
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    const data = await this.service.create(dto, societyId, userId, role);
    return {
      success: true,
      message: 'Visitor registered successfully',
      data,
    };
  }

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiGetVisitors()
  async findAll(
    @CurrentUser('societyId') societyId: string,
    @CurrentUser('role') role: UserRole,
    @CurrentUser('userId') userId: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ) {
    const data = await this.service.findAll(societyId, role, userId, { status, type });
    return {
      success: true,
      message: 'Visitors retrieved successfully',
      data,
    };
  }

  @Get(':logId')
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiGetVisitor()
  async findOne(
    @Param('logId') logId: string,
    @CurrentUser('societyId') societyId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    const data = await this.service.findOne(logId, societyId);
    if (role !== UserRoles.RESIDENTS && data) {
      const plain = data.toObject();
      delete plain.passCode;
      return {
        success: true,
        message: 'Visitor retrieved successfully',
        data: plain,
      };
    }
    return {
      success: true,
      message: 'Visitor retrieved successfully',
      data,
    };
  }

  @Get(':logId/visits')
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  async findVisits(
    @Param('logId') logId: string,
    @CurrentUser('societyId') societyId: string,
  ) {
    const data = await this.service.findVisitsByLogId(logId, societyId);
    return {
      success: true,
      message: 'Visitor visits retrieved successfully',
      data,
    };
  }

  @Post('request-entry')
  @Roles(UserRoles.ADMIN, UserRoles.GUARD)
  async requestEntry(
    @Body() dto: RequestEntryDto,
    @CurrentUser('societyId') societyId: string,
    @CurrentUser('firstName') firstName: string,
    @CurrentUser('lastName') lastName: string,
  ) {
    const scannedBy = (firstName || lastName)
      ? `${firstName ?? ''} ${lastName ?? ''}`.trim()
      : 'Security Guard';
    const data = await this.service.requestEntry(
      { ...dto, flatId: dto.flatId },
      societyId,
      scannedBy,
    );
    return {
      success: true,
      message: 'Approval request sent to resident',
      data,
    };
  }

  @Patch(':logId/status')
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiUpdateVisitorStatus()
  async updateStatus(
    @Param('logId') logId: string,
    @CurrentUser('societyId') societyId: string,
    @Body() dto: UpdateVisitorStatusDto,
  ) {
    const data = await this.service.updateStatus(logId, societyId, dto.status);
    return {
      success: true,
      message: `Visitor status updated to ${dto.status}`,
      data,
    };
  }

  @Patch('scan/:passCode')
  @Roles(UserRoles.ADMIN, UserRoles.GUARD)
  @ApiScanPassCode()
  async scanPassCode(
    @Param('passCode') passCode: string,
    @Query('type') type: 'entry' | 'exit',
    @CurrentUser('userId') userId: string,
    @CurrentUser('societyId') societyId: string,
    @CurrentUser('firstName') firstName: string,
    @CurrentUser('lastName') lastName: string,
  ) {
    const scannedBy = (firstName || lastName)
      ? `${firstName ?? ''} ${lastName ?? ''}`.trim()
      : 'Security Guard';
    const data = await this.service.scanPassCode(passCode, societyId, type, scannedBy, userId);
    return {
      success: true,
      message: `Pass code scanned for ${type}`,
      data,
    };
  }
}

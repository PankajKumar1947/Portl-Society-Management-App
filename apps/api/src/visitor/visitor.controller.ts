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
  ApiVerifyPassCode,
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

  @Get('verify/:passCode')
  @Roles(UserRoles.ADMIN, UserRoles.GUARD)
  @ApiVerifyPassCode()
  async verifyPassCode(
    @Param('passCode') passCode: string,
    @CurrentUser('societyId') societyId: string,
  ) {
    const data = await this.service.verifyPassCode(passCode, societyId);
    return {
      success: true,
      message: 'Pass code verified successfully',
      data,
    };
  }

  @Get(':visitorId')
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiGetVisitor()
  async findOne(
    @Param('visitorId') visitorId: string,
    @CurrentUser('societyId') societyId: string,
  ) {
    const data = await this.service.findOne(visitorId, societyId);
    return {
      success: true,
      message: 'Visitor retrieved successfully',
      data,
    };
  }

  @Patch(':visitorId/status')
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiUpdateVisitorStatus()
  async updateStatus(
    @Param('visitorId') visitorId: string,
    @CurrentUser('societyId') societyId: string,
    @Body('status') status: 'approved' | 'rejected' | 'completed',
  ) {
    const data = await this.service.updateStatus(visitorId, societyId, status);
    return {
      success: true,
      message: `Visitor status updated to ${status}`,
      data,
    };
  }
}

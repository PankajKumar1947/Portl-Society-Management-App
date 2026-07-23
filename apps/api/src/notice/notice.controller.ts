import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { UserRoles, UserRole } from '@repo/schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  ApiCreateNotice,
  ApiGetNotices,
  ApiGetNotice,
  ApiUpdateNotice,
  ApiDeleteNotice,
  ApiPublishNotice,
} from './notice.docs';

@ApiTags('notices')
@Controller('notices')
@UseGuards(JwtGuard, RolesGuard, TenantGuard)
@UsePipes(new ZodValidationPipe())
export class NoticeController {
  constructor(private readonly service: NoticeService) {}

  @Post()
  @Roles(UserRoles.ADMIN)
  @ApiCreateNotice()
  async create(
    @Body() dto: CreateNoticeDto,
    @CurrentUser('societyId') societyId: string,
    @CurrentUser('userId') userId: string,
  ) {
    const data = await this.service.create(dto, societyId, userId);
    return {
      success: true,
      message: 'Notice created successfully',
      data,
    };
  }

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiGetNotices()
  async findAll(
    @CurrentUser('societyId') societyId: string,
    @CurrentUser('role') role: UserRole,
    @CurrentUser('userId') userId: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('recipient') recipient?: string,
  ) {
    const data = await this.service.findAll(societyId, role, { search, status, recipient, userId });
    return {
      success: true,
      message: 'Notices retrieved successfully',
      data,
    };
  }

  @Get(':noticeId')
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiGetNotice()
  async findOne(
    @Param('noticeId') noticeId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    const data = await this.service.findOne(noticeId, role);
    return {
      success: true,
      message: 'Notice details retrieved successfully',
      data,
    };
  }

  @Patch(':noticeId')
  @Roles(UserRoles.ADMIN)
  @ApiUpdateNotice()
  async update(
    @Param('noticeId') noticeId: string,
    @Body() dto: UpdateNoticeDto,
  ) {
    const data = await this.service.update(noticeId, dto);
    return {
      success: true,
      message: 'Notice updated successfully',
      data,
    };
  }

  @Delete(':noticeId')
  @Roles(UserRoles.ADMIN)
  @ApiDeleteNotice()
  async remove(@Param('noticeId') noticeId: string) {
    await this.service.remove(noticeId);
    return { success: true, message: 'Notice deleted successfully' };
  }

  @Post(':noticeId/publish')
  @Roles(UserRoles.ADMIN)
  @ApiPublishNotice()
  async publish(@Param('noticeId') noticeId: string) {
    const data = await this.service.publish(noticeId);
    return {
      success: true,
      message: 'Notice published successfully',
      data,
    };
  }
}

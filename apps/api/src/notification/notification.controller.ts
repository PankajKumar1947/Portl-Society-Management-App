import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { RegisterFcmTokenDto } from './dto/register-token.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserService } from '../user/user.service';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtGuard, RolesGuard, TenantGuard)
@UsePipes(new ZodValidationPipe())
export class NotificationController {
  constructor(
    private readonly service: NotificationService,
    private readonly userService: UserService,
  ) {}

  @Post('register-token')
  async registerToken(
    @Body() dto: RegisterFcmTokenDto,
    @CurrentUser('userId') userId: string,
  ) {
    await this.userService.update(userId, { fcmToken: dto.token });
    return { success: true, message: 'FCM token registered' };
  }

  @Get()
  async findAll(
    @CurrentUser('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    const data = await this.service.findByUserId(
      userId,
      limit ? parseInt(limit, 10) : 50,
      skip ? parseInt(skip, 10) : 0,
    );
    return { success: true, data };
  }

  @Get('unread-count')
  async unreadCount(@CurrentUser('userId') userId: string) {
    const count = await this.service.countUnread(userId);
    return { success: true, data: { count } };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    const data = await this.service.markAsRead(id);
    return { success: true, data };
  }

  @Post('mark-all-read')
  async markAllAsRead(@CurrentUser('userId') userId: string) {
    await this.service.markAllAsRead(userId);
    return { success: true, message: 'All notifications marked as read' };
  }
}

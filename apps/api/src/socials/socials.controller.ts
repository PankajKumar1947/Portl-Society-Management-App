import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UsePipes,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SocialsService } from './socials.service';
import { CreatePostDto, CreateCommentDto } from './dto/socials.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { UserRoles } from '@repo/schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  ApiCreatePost,
  ApiGetPosts,
  ApiGetPost,
  ApiCreateComment,
  ApiToggleLike,
} from './socials.docs';

@ApiTags('socials')
@Controller('socials')
@UseGuards(JwtGuard, RolesGuard, TenantGuard)
@UsePipes(new ZodValidationPipe())
export class SocialsController {
  constructor(private readonly service: SocialsService) {}

  @Post()
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiCreatePost()
  async create(
    @Body() dto: CreatePostDto,
    @CurrentUser('societyId') societyId: string,
    @CurrentUser('userId') userId: string,
  ) {
    const data = await this.service.create(dto, societyId, userId);
    return {
      success: true,
      message: 'Post created successfully',
      data,
    };
  }

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiGetPosts()
  async findAll(
    @CurrentUser('societyId') societyId: string,
    @CurrentUser('userId') userId: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('timeRange') timeRange?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const data = await this.service.findAll(societyId, userId, search, role, timeRange, startDate, endDate);
    return {
      success: true,
      message: 'Socials feed retrieved successfully',
      data,
    };
  }

  @Get(':id')
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiGetPost()
  async findOne(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    const data = await this.service.findOne(id, userId);
    return {
      success: true,
      message: 'Post details retrieved successfully',
      data,
    };
  }

  @Post(':id/comments')
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiCreateComment()
  async addComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser('userId') userId: string,
  ) {
    const data = await this.service.addComment(id, dto, userId);
    return {
      success: true,
      message: 'Comment added successfully',
      data,
    };
  }

  @Post(':id/like')
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiToggleLike()
  async toggleLike(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    const data = await this.service.toggleLike(id, userId);
    return {
      success: true,
      message: 'Like state updated successfully',
      data,
    };
  }
}

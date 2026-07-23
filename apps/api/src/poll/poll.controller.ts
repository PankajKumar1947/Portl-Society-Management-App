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
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { CastVoteDto } from './dto/cast-vote.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { UserRoles, UserRole } from '@repo/schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  ApiCreatePoll,
  ApiGetPolls,
  ApiGetPoll,
  ApiUpdatePoll,
  ApiDeletePoll,
  ApiPublishPoll,
  ApiClosePoll,
  ApiCastVote,
  ApiGetResults,
} from './poll.docs';

@ApiTags('polls')
@Controller('polls')
@UseGuards(JwtGuard, RolesGuard, TenantGuard)
@UsePipes(new ZodValidationPipe())
export class PollController {
  constructor(private readonly service: PollService) {}

  @Post()
  @Roles(UserRoles.ADMIN)
  @ApiCreatePoll()
  async create(
    @Body() dto: CreatePollDto,
    @CurrentUser('societyId') societyId: string,
    @CurrentUser('userId') userId: string,
  ) {
    const data = await this.service.create(dto, societyId, userId);
    return { success: true, message: 'Poll created successfully', data };
  }

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiGetPolls()
  async findAll(
    @CurrentUser('societyId') societyId: string,
    @CurrentUser('role') role: UserRole,
    @CurrentUser('userId') userId: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('recipient') recipient?: string,
  ) {
    const data = await this.service.findAll(societyId, role, { search, status, recipient, userId });
    return { success: true, message: 'Polls retrieved successfully', data };
  }

  @Get(':pollId')
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiGetPoll()
  async findOne(
    @Param('pollId') pollId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    const data = await this.service.findOne(pollId, role);
    return { success: true, message: 'Poll details retrieved successfully', data };
  }

  @Patch(':pollId')
  @Roles(UserRoles.ADMIN)
  @ApiUpdatePoll()
  async update(
    @Param('pollId') pollId: string,
    @Body() dto: UpdatePollDto,
  ) {
    const data = await this.service.update(pollId, dto);
    return { success: true, message: 'Poll updated successfully', data };
  }

  @Delete(':pollId')
  @Roles(UserRoles.ADMIN)
  @ApiDeletePoll()
  async remove(@Param('pollId') pollId: string) {
    await this.service.remove(pollId);
    return { success: true, message: 'Poll deleted successfully' };
  }

  @Post(':pollId/publish')
  @Roles(UserRoles.ADMIN)
  @ApiPublishPoll()
  async publish(@Param('pollId') pollId: string) {
    const data = await this.service.publish(pollId);
    return { success: true, message: 'Poll published successfully', data };
  }

  @Post(':pollId/close')
  @Roles(UserRoles.ADMIN)
  @ApiClosePoll()
  async close(@Param('pollId') pollId: string) {
    const data = await this.service.close(pollId);
    return { success: true, message: 'Poll closed successfully', data };
  }

  @Post(':pollId/vote')
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiCastVote()
  async castVote(
    @Param('pollId') pollId: string,
    @Body() dto: CastVoteDto,
    @CurrentUser('userId') userId: string,
    @CurrentUser('societyId') societyId: string,
  ) {
    const data = await this.service.castVote(pollId, userId, societyId, dto);
    return { success: true, message: 'Vote cast successfully', data };
  }

  @Get(':pollId/results')
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiGetResults()
  async getResults(
    @Param('pollId') pollId: string,
    @CurrentUser('userId') userId: string,
  ) {
    const data = await this.service.getResults(pollId, userId);
    return { success: true, message: 'Poll results retrieved successfully', data };
  }
}

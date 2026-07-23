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
import { GuardService } from './guard.service';
import { UpdateGuardDto } from './dto/update-guard.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OnboardGuardPersonalDto } from './dto/onboard-guard-personal.dto';
import { OnboardGuardDutyDto } from './dto/onboard-guard-duty.dto';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { UserRoles } from '@repo/schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  ApiOnboardGuardPersonal,
  ApiOnboardGuardDuty,
  ApiGetGuards,
  ApiGetGuard,
  ApiUpdateGuard,
  ApiDeleteGuard,
} from './guard.docs';

@ApiTags('guards')
@Controller('guards')
@UseGuards(JwtGuard, RolesGuard, TenantGuard)
@UsePipes(new ZodValidationPipe())
export class GuardController {
  constructor(private readonly service: GuardService) { }

  @Post('onboard/personal')
  @Roles(UserRoles.ADMIN)
  @ApiOnboardGuardPersonal()
  async onboardPersonal(
    @Body() dto: OnboardGuardPersonalDto,
    @CurrentUser('societyId') societyId: string,
  ) {
    const result = await this.service.onboardPersonal(dto, societyId);
    return {
      message: 'OTP triggered. Verify email address.',
      ...result,
    };
  }

  @Post('onboard/duty')
  @Roles(UserRoles.ADMIN)
  @ApiOnboardGuardDuty()
  async onboardDuty(
    @Body() dto: OnboardGuardDutyDto,
    @CurrentUser('societyId') societyId: string,
  ) {
    const guard = await this.service.onboardDuty(dto, societyId);
    return {
      message: 'Guard onboarding complete.',
      guard,
    };
  }

  @Get()
  @Roles(UserRoles.ADMIN)
  @ApiGetGuards()
  async findAll(
    @CurrentUser('societyId') societyId: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    const data = await this.service.findAll(societyId, { type, search });
    return {
      success: true,
      message: 'Guards retrieved successfully',
      data,
    };
  }

  @Get(':guardId')
  @Roles(UserRoles.ADMIN)
  @ApiGetGuard()
  async findOne(@Param('guardId') guardId: string) {
    const data = await this.service.findOne(guardId);
    return {
      success: true,
      message: 'Guard details retrieved successfully',
      data,
    };
  }

  @Patch(':guardId')
  @Roles(UserRoles.ADMIN)
  @ApiUpdateGuard()
  async update(
    @Param('guardId') guardId: string,
    @Body() dto: UpdateGuardDto,
  ) {
    const guard = await this.service.update(guardId, dto);
    return {
      message: 'Guard details updated successfully',
      guard,
    };
  }

  @Delete(':guardId')
  @Roles(UserRoles.ADMIN)
  @ApiDeleteGuard()
  async remove(@Param('guardId') guardId: string) {
    await this.service.remove(guardId);
    return { message: 'Security Guard deleted successfully' };
  }
}

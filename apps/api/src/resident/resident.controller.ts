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
import { ResidentService } from './resident.service';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { ResidentPersonalDto } from './dto/resident-personal.dto';
import { ResidentAllotmentDto } from './dto/resident-allotment.dto';
import { ResidentVehicleDto } from './dto/resident-vehicle.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { UserRoles } from '@repo/schema';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TokenPayload } from '../shared/token/token.service';
import {
  ApiCreateResident,
  ApiGetResidents,
  ApiGetResident,
  ApiUpdateResident,
  ApiDeleteResident,
} from './resident.docs';

@ApiTags('residents')
@Controller('residents')
@UseGuards(JwtGuard, RolesGuard, TenantGuard)
@UsePipes(new ZodValidationPipe())
export class ResidentController {
  constructor(private readonly service: ResidentService) {}

  @Post()
  @Roles(UserRoles.ADMIN)
  @ApiCreateResident()
  async create(@Body() dto: CreateResidentDto) {
    const resident = await this.service.create(dto);
    return {
      success: true,
      message: 'Resident registered successfully',
      data: resident,
    };
  }

  @Post('onboard/personal')
  @Roles(UserRoles.ADMIN)
  async onboardPersonal(
    @CurrentUser() user: TokenPayload,
    @Body() dto: ResidentPersonalDto,
    @Query('societyId') querySocietyId?: string,
  ) {
    const societyId = querySocietyId || user.societyId;
    if (!societyId) {
      return {
        success: false,
        message: 'Society context not found',
      };
    }
    const resident = await this.service.onboardPersonal(dto, societyId);
    return {
      success: true,
      message: 'User account created and resident profile initialized',
      data: resident,
    };
  }

  @Post('onboard/allotment')
  @Roles(UserRoles.ADMIN)
  async onboardAllotment(
    @CurrentUser() user: TokenPayload,
    @Body() dto: ResidentAllotmentDto,
    @Query('societyId') querySocietyId?: string,
  ) {
    const societyId = querySocietyId || user.societyId;
    if (!societyId) {
      return {
        success: false,
        message: 'Society context not found',
      };
    }
    const resident = await this.service.onboardAllotment(societyId, dto);
    return {
      success: true,
      message: 'Resident allotment details completed and profile created',
      data: resident,
    };
  }

  @Patch('onboard/vehicle/:residentId')
  @Roles(UserRoles.ADMIN)
  async onboardVehicle(
    @Param('residentId') residentId: string,
    @Body() dto: ResidentVehicleDto,
  ) {
    const resident = await this.service.onboardVehicle(residentId, dto);
    return {
      success: true,
      message: 'Resident vehicle details completed',
      data: resident,
    };
  }

  @Get()
  @ApiGetResidents()
  async findAll(
    @CurrentUser() user: TokenPayload,
    @Query('societyId') querySocietyId?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    const societyId = querySocietyId || user.societyId;
    if (!societyId) {
      return {
        success: false,
        message: 'Society context not found',
        data: [],
      };
    }
    const residents = await this.service.findAll(societyId, { type, search });
    return {
      success: true,
      message: 'Residents fetched successfully',
      data: residents,
    };
  }

  @Get(':residentId')
  @ApiGetResident()
  async findOne(@Param('residentId') residentId: string) {
    const resident = await this.service.findOne(residentId);
    return {
      success: true,
      message: 'Resident fetched successfully',
      data: resident,
    };
  }

  @Patch(':residentId')
  @Roles(UserRoles.ADMIN)
  @ApiUpdateResident()
  async update(
    @Param('residentId') residentId: string,
    @Body() dto: UpdateResidentDto,
  ) {
    const resident = await this.service.update(residentId, dto);
    return {
      success: true,
      message: 'Resident updated successfully',
      data: resident,
    };
  }

  @Delete(':residentId')
  @Roles(UserRoles.ADMIN)
  @ApiDeleteResident()
  async remove(@Param('residentId') residentId: string) {
    await this.service.remove(residentId);
    return {
      success: true,
      message: 'Resident deleted successfully',
      data: null,
    };
  }
}

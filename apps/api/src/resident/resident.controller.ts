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
import { AddVehicleDto } from './dto/add-vehicle.dto';
import { AddFamilyMemberDto } from './dto/add-family-member.dto';
import { UpdateFamilyMemberDto } from './dto/update-family-member.dto';
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
  ApiGetMyResident,
  ApiGetFamilyMembers,
  ApiAddFamilyMember,
} from './resident.docs';

@ApiTags('residents')
@Controller('residents')
@UseGuards(JwtGuard, RolesGuard, TenantGuard)
@UsePipes(new ZodValidationPipe())
export class ResidentController {
  constructor(private readonly service: ResidentService) { }

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
  @Roles(UserRoles.ADMIN, UserRoles.GUARD)
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

  @Get('me')
  @Roles(UserRoles.RESIDENTS)
  @ApiGetMyResident()
  async getMyResident(@CurrentUser() user: TokenPayload) {
    if (!user.societyId) {
      return { success: false, message: 'Society context not found', data: null };
    }
    const resident = await this.service.findByUserId(user.userId, user.societyId);
    return {
      success: true,
      message: 'Resident profile fetched successfully',
      data: resident,
    };
  }

  @Get('family-members')
  @Roles(UserRoles.RESIDENTS)
  @ApiGetFamilyMembers()
  async getFamilyMembers(@CurrentUser() user: TokenPayload) {
    if (!user.societyId) {
      return { success: false, message: 'Society context not found', data: [] };
    }
    const members = await this.service.getMyFamilyMembers(user.userId, user.societyId);
    return {
      success: true,
      message: 'Family members fetched successfully',
      data: members,
    };
  }

  @Post('family-members')
  @Roles(UserRoles.RESIDENTS)
  @ApiAddFamilyMember()
  async addFamilyMember(
    @CurrentUser() user: TokenPayload,
    @Body() dto: AddFamilyMemberDto,
  ) {
    if (!user.societyId) {
      return { success: false, message: 'Society context not found', data: null };
    }
    const member = await this.service.addFamilyMember(user.userId, user.societyId, dto);
    return {
      success: true,
      message: 'Family member added successfully',
      data: member,
    };
  }

  @Get('family-members/:familyMemberId')
  @Roles(UserRoles.RESIDENTS)
  async getFamilyMember(
    @Param('familyMemberId') familyMemberId: string,
  ) {
    const member = await this.service.getFamilyMember(familyMemberId);
    return {
      success: true,
      message: 'Family member retrieved successfully',
      data: member,
    };
  }

  @Patch('family-members/:familyMemberId')
  @Roles(UserRoles.RESIDENTS)
  async updateFamilyMember(
    @Param('familyMemberId') familyMemberId: string,
    @Body() dto: UpdateFamilyMemberDto,
  ) {
    const member = await this.service.updateFamilyMember(familyMemberId, dto);
    return {
      success: true,
      message: 'Family member updated successfully',
      data: member,
    };
  }

  @Delete('family-members/:familyMemberId')
  @Roles(UserRoles.RESIDENTS)
  async deleteFamilyMember(
    @Param('familyMemberId') familyMemberId: string,
  ) {
    await this.service.deleteFamilyMember(familyMemberId);
    return {
      success: true,
      message: 'Family member deleted successfully',
      data: null,
    };
  }

  @Get('vehicles')
  @Roles(UserRoles.RESIDENTS)
  async getMyVehicles(@CurrentUser() user: TokenPayload) {
    if (!user.societyId) {
      return { success: false, message: 'Society context not found', data: [] };
    }
    const vehicles = await this.service.getMyVehicles(user.userId, user.societyId);
    return {
      success: true,
      message: 'Vehicles fetched successfully',
      data: vehicles,
    };
  }

  @Post('vehicles')
  @Roles(UserRoles.RESIDENTS)
  async addVehicle(
    @CurrentUser() user: TokenPayload,
    @Body() dto: AddVehicleDto,
  ) {
    if (!user.societyId) {
      return { success: false, message: 'Society context not found', data: null };
    }
    const vehicle = await this.service.addVehicle(user.userId, user.societyId, dto);
    return {
      success: true,
      message: 'Vehicle added successfully',
      data: vehicle,
    };
  }

  @Delete('vehicles/:vehicleId')
  @Roles(UserRoles.RESIDENTS)
  async deleteVehicle(
    @Param('vehicleId') vehicleId: string,
  ) {
    await this.service.deleteVehicle(vehicleId);
    return {
      success: true,
      message: 'Vehicle deleted successfully',
      data: null,
    };
  }

  @Get('vehicles/:vehicleId')
  @Roles(UserRoles.RESIDENTS)
  async getVehicle(
    @Param('vehicleId') vehicleId: string,
  ) {
    const vehicle = await this.service.getVehicle(vehicleId);
    return {
      success: true,
      message: 'Vehicle retrieved successfully',
      data: vehicle,
    };
  }

  @Patch('vehicles/:vehicleId')
  @Roles(UserRoles.RESIDENTS)
  async updateVehicle(
    @Param('vehicleId') vehicleId: string,
    @Body() dto: AddVehicleDto,
  ) {
    const vehicle = await this.service.updateVehicle(vehicleId, dto);
    return {
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle,
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

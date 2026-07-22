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
import { CreateResidentDto, UpdateResidentDto } from './dto/resident.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { UserRoles } from '@repo/schema';
import { ResidentOwnershipGuard } from './guards/resident-ownership.guard';
import {
  ApiCreateResident,
  ApiGetResidents,
  ApiGetResident,
  ApiUpdateResident,
  ApiDeleteResident,
} from './resident.docs';

@ApiTags('residents')
@Controller('residents')
@UseGuards(JwtGuard, RolesGuard)
@UsePipes(new ZodValidationPipe())
export class ResidentController {
  constructor(private readonly service: ResidentService) {}

  @Post()
  @Roles(UserRoles.ADMIN)
  @UseGuards(ResidentOwnershipGuard)
  @ApiCreateResident()
  async create(@Body() dto: CreateResidentDto) {
    const resident = await this.service.create(dto);
    return {
      success: true,
      message: 'Resident registered successfully',
      data: resident,
    };
  }

  @Get()
  @UseGuards(ResidentOwnershipGuard)
  @ApiGetResidents()
  async findAll(
    @Query('societyId') societyId: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    const residents = await this.service.findAll(societyId, { type, search });
    return {
      success: true,
      message: 'Residents fetched successfully',
      data: residents,
    };
  }

  @Get(':residentId')
  @UseGuards(ResidentOwnershipGuard)
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
  @UseGuards(ResidentOwnershipGuard)
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
  @UseGuards(ResidentOwnershipGuard)
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

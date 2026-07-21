import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SocietyService } from './society.service';
import { CreateSocietyDto } from './dto/create-society.dto';
import { UpdateSocietyDto } from './dto/update-society.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../zod-validation.pipe';
import {
  ApiCreateSociety,
  ApiGetSociety,
  ApiGetSocietyByUserId,
  ApiUpdateSociety,
} from './society.docs';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SocietyOwnershipGuard } from './guards/society-ownership.guard';
import { UserRoles } from '@repo/schema';

@ApiTags('societies')
@Controller('societies')
@UseGuards(JwtGuard, RolesGuard)
@UsePipes(new ZodValidationPipe())
export class SocietyController {
  constructor(private readonly societyService: SocietyService) {}

  @Post()
  @Roles(UserRoles.ADMIN)
  @ApiCreateSociety()
  async create(
    @Body() createSocietyDto: CreateSocietyDto,
    @CurrentUser('userId') userId: string,
  ) {
    const society = await this.societyService.create(createSocietyDto, userId);
    return {
      message: 'Society setup completed successfully',
      society,
    };
  }

  @Get('me')
  @ApiGetSocietyByUserId()
  async findMe(@CurrentUser('userId') userId: string) {
    return this.societyService.findByUserId(userId);
  }

  @Get(':societyId')
  @UseGuards(SocietyOwnershipGuard)
  @ApiGetSociety()
  async findOne(@Param('societyId') societyId: string) {
    return this.societyService.findOne(societyId);
  }

  @Patch(':societyId')
  @Roles(UserRoles.ADMIN)
  @UseGuards(SocietyOwnershipGuard)
  @ApiUpdateSociety()
  async update(
    @Param('societyId') societyId: string,
    @Body() updateSocietyDto: UpdateSocietyDto,
  ) {
    return this.societyService.update(societyId, updateSocietyDto);
  }
}

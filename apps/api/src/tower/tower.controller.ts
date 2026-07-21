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
import { TowerService } from './tower.service';
import { CreateTowerDto } from './dto/create-tower.dto';
import { UpdateTowerDto } from './dto/update-tower.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { UserRoles } from '@repo/schema';
import { TowerOwnershipGuard } from './guards/tower-ownership.guard';
import {
  ApiCreateTower,
  ApiGetTowers,
  ApiGetTower,
  ApiUpdateTower,
  ApiDeleteTower,
} from './tower.docs';

@ApiTags('towers')
@Controller('towers')
@UseGuards(JwtGuard, RolesGuard)
@UsePipes(new ZodValidationPipe())
export class TowerController {
  constructor(private readonly towerService: TowerService) {}

  @Post()
  @Roles(UserRoles.ADMIN)
  @UseGuards(TowerOwnershipGuard)
  @ApiCreateTower()
  async create(@Body() createTowerDto: CreateTowerDto) {
    return this.towerService.create(createTowerDto);
  }

  @Get()
  @UseGuards(TowerOwnershipGuard)
  @ApiGetTowers()
  async findBySociety(@Query('societyId') societyId: string) {
    return this.towerService.findBySocietyId(societyId);
  }

  @Get(':towerId')
  @UseGuards(TowerOwnershipGuard)
  @ApiGetTower()
  async findOne(@Param('towerId') towerId: string) {
    return this.towerService.findOne(towerId);
  }

  @Patch(':towerId')
  @Roles(UserRoles.ADMIN)
  @UseGuards(TowerOwnershipGuard)
  @ApiUpdateTower()
  async update(
    @Param('towerId') towerId: string,
    @Body() updateTowerDto: UpdateTowerDto,
  ) {
    return this.towerService.update(towerId, updateTowerDto);
  }

  @Delete(':towerId')
  @Roles(UserRoles.ADMIN)
  @UseGuards(TowerOwnershipGuard)
  @ApiDeleteTower()
  async remove(@Param('towerId') towerId: string) {
    await this.towerService.remove(towerId);
    return { message: 'Tower deleted successfully' };
  }
}

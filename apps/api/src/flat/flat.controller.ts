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
import { FlatService } from './flat.service';
import { CreateFlatDto } from './dto/create-flat.dto';
import { UpdateFlatDto } from './dto/update-flat.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { UserRoles } from '@repo/schema';
import { FlatOwnershipGuard } from './guards/flat-ownership.guard';
import {
  ApiCreateFlat,
  ApiGetFlats,
  ApiGetFlat,
  ApiUpdateFlat,
  ApiDeleteFlat,
} from './flat.docs';

@ApiTags('flats')
@Controller('flats')
@UseGuards(JwtGuard, RolesGuard)
@UsePipes(new ZodValidationPipe())
export class FlatController {
  constructor(private readonly flatService: FlatService) {}

  @Post()
  @Roles(UserRoles.ADMIN)
  @UseGuards(FlatOwnershipGuard)
  @ApiCreateFlat()
  async create(@Body() createFlatDto: CreateFlatDto) {
    return this.flatService.create(createFlatDto);
  }

  @Get()
  @UseGuards(FlatOwnershipGuard)
  @ApiGetFlats()
  async findByTower(@Query('towerId') towerId: string) {
    return this.flatService.findByTowerId(towerId);
  }

  @Get(':flatId')
  @UseGuards(FlatOwnershipGuard)
  @ApiGetFlat()
  async findOne(@Param('flatId') flatId: string) {
    return this.flatService.findOne(flatId);
  }

  @Patch(':flatId')
  @Roles(UserRoles.ADMIN)
  @UseGuards(FlatOwnershipGuard)
  @ApiUpdateFlat()
  async update(
    @Param('flatId') flatId: string,
    @Body() updateFlatDto: UpdateFlatDto,
  ) {
    return this.flatService.update(flatId, updateFlatDto);
  }

  @Delete(':flatId')
  @Roles(UserRoles.ADMIN)
  @UseGuards(FlatOwnershipGuard)
  @ApiDeleteFlat()
  async remove(@Param('flatId') flatId: string) {
    await this.flatService.remove(flatId);
    return { message: 'Flat deleted successfully' };
  }
}

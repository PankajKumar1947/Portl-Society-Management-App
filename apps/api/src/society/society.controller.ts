import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UsePipes,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SocietyService } from './society.service';
import { CreateSocietyDto } from './dto/create-society.dto';
import { UpdateSocietyDto } from './dto/update-society.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ZodValidationPipe } from '../zod-validation.pipe';
import {
  ApiCreateSociety,
  ApiGetSociety,
  ApiGetSocietyByUserId,
  ApiUpdateSociety,
} from './society.docs';

import { Request as ExpressRequest } from 'express';

interface RequestWithUser extends ExpressRequest {
  user: {
    userId: string;
    email: string;
  };
}

@ApiTags('societies')
@Controller('societies')
@UseGuards(JwtGuard)
@UsePipes(new ZodValidationPipe())
export class SocietyController {
  constructor(private readonly societyService: SocietyService) {}

  @Post()
  @ApiCreateSociety()
  async create(
    @Body() createSocietyDto: CreateSocietyDto,
    @Request() req: RequestWithUser,
  ) {
    const { userId } = req.user;
    const society = await this.societyService.create(createSocietyDto, userId);
    return {
      message: 'Society setup completed successfully',
      society,
    };
  }

  @Get('me')
  @ApiGetSocietyByUserId()
  async findMe(@Request() req: RequestWithUser) {
    const { userId } = req.user;
    return this.societyService.findByUserId(userId);
  }

  @Get(':societyId')
  @ApiGetSociety()
  async findOne(@Param('societyId') societyId: string) {
    return this.societyService.findOne(societyId);
  }

  @Patch(':societyId')
  @ApiUpdateSociety()
  async update(
    @Param('societyId') societyId: string,
    @Body() updateSocietyDto: UpdateSocietyDto,
  ) {
    return this.societyService.update(societyId, updateSocietyDto);
  }
}

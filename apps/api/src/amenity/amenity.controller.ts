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
} from "@nestjs/common";
import { AmenityService } from "./amenity.service";
import { CreateAmenityDto } from "./dto/create-amenity.dto";
import { UpdateAmenityDto } from "./dto/update-amenity.dto";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { ZodValidationPipe } from "../zod-validation.pipe";
import { TenantGuard } from "../auth/guards/tenant.guard";
import { UserRoles } from "@repo/schema";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import {
  ApiAmenityController,
  ApiCreateAmenity,
  ApiGetAmenities,
  ApiGetAmenityDetail,
  ApiUpdateAmenity,
  ApiDeleteAmenity,
} from "./amenity.docs";

@ApiAmenityController()
@Controller("amenities")
@UseGuards(JwtGuard, RolesGuard, TenantGuard)
@UsePipes(new ZodValidationPipe())
export class AmenityController {
  constructor(private readonly service: AmenityService) { }

  @Post()
  @Roles(UserRoles.ADMIN)
  @ApiCreateAmenity()
  async create(
    @Body() dto: CreateAmenityDto,
    @CurrentUser("societyId") societyId: string,
  ) {
    const data = await this.service.create(societyId, dto);
    return {
      success: true,
      message: "Amenity created successfully",
      data,
    };
  }

  @Get()
  @ApiGetAmenities()
  async findAll(
    @CurrentUser("societyId") societyId: string,
    @Query("search") search?: string,
    @Query("category") category?: string,
    @Query("type") type?: string,
    @Query("status") status?: string,
    @Query("towerIds") towerIds?: string,
  ) {
    const data = await this.service.findAll(societyId, {
      search,
      category,
      type,
      status,
      towerIds: towerIds ? towerIds.split(",") : undefined,
    });
    return {
      success: true,
      data,
    };
  }

  @Get(":id")
  @Roles(UserRoles.ADMIN, UserRoles.RESIDENTS)
  @ApiGetAmenityDetail()
  async findOne(
    @Param("id") id: string,
    @CurrentUser("societyId") societyId: string,
  ) {
    const data = await this.service.findOne(id, societyId);
    return {
      success: true,
      data,
    };
  }

  @Patch(":id")
  @Roles(UserRoles.ADMIN)
  @ApiUpdateAmenity()
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateAmenityDto,
    @CurrentUser("societyId") societyId: string,
  ) {
    const data = await this.service.update(id, societyId, dto);
    return {
      success: true,
      message: "Amenity updated successfully",
      data,
    };
  }

  @Delete(":id")
  @Roles(UserRoles.ADMIN)
  @ApiDeleteAmenity()
  async remove(
    @Param("id") id: string,
    @CurrentUser("societyId") societyId: string,
  ) {
    const result = await this.service.remove(id, societyId);
    return {
      success: result.success,
      message: "Amenity deleted successfully",
    };
  }
}

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
import { ApiTags } from "@nestjs/swagger";
import { ComplaintService } from "./complaint.service";
import { CreateComplaintDto } from "./dto/create-complaint.dto";
import { UpdateComplaintDto } from "./dto/update-complaint.dto";
import { AddTimelineEntryDto } from "./dto/add-timeline-entry.dto";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { ZodValidationPipe } from "../zod-validation.pipe";
import { TenantGuard } from "../auth/guards/tenant.guard";
import { UserRoles, UserRole } from "@repo/schema";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import {
  ApiCreateComplaint,
  ApiGetComplaints,
  ApiGetComplaint,
  ApiUpdateComplaint,
  ApiDeleteComplaint,
  ApiAddTimelineEntry,
} from "./complaint.docs";

@ApiTags("complaints")
@Controller("complaints")
@UseGuards(JwtGuard, RolesGuard, TenantGuard)
@UsePipes(new ZodValidationPipe())
export class ComplaintController {
  constructor(private readonly service: ComplaintService) {}

  @Post()
  @Roles(UserRoles.ADMIN, UserRoles.RESIDENTS)
  @ApiCreateComplaint()
  async create(
    @Body() dto: CreateComplaintDto,
    @CurrentUser("societyId") societyId: string,
    @CurrentUser("userId") userId: string,
  ) {
    const data = await this.service.create(dto, societyId, userId);
    return { success: true, message: "Complaint submitted successfully", data };
  }

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiGetComplaints()
  async findAll(
    @CurrentUser("societyId") societyId: string,
    @CurrentUser("role") role: UserRole,
    @CurrentUser("userId") userId: string,
    @Query("search") search?: string,
    @Query("status") status?: string,
    @Query("category") category?: string,
  ) {
    const data = await this.service.findAll(societyId, role, {
      search,
      status,
      category,
      userId,
    });
    return { success: true, data };
  }

  @Get(":complaintId")
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiGetComplaint()
  async findOne(@Param("complaintId") complaintId: string) {
    const data = await this.service.findOne(complaintId);
    return { success: true, data };
  }

  @Patch(":complaintId")
  @Roles(UserRoles.ADMIN)
  @ApiUpdateComplaint()
  async update(
    @Param("complaintId") complaintId: string,
    @Body() dto: UpdateComplaintDto,
    @CurrentUser("userId") userId: string,
    @CurrentUser("role") role: UserRole,
  ) {
    const data = await this.service.update(complaintId, dto, userId, role);
    return { success: true, message: "Complaint updated successfully", data };
  }

  @Delete(":complaintId")
  @Roles(UserRoles.ADMIN)
  @ApiDeleteComplaint()
  async remove(
    @Param("complaintId") complaintId: string,
    @CurrentUser("role") role: UserRole,
  ) {
    await this.service.remove(complaintId, role);
    return { success: true, message: "Complaint deleted successfully" };
  }

  @Post(":complaintId/timeline")
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiAddTimelineEntry()
  async addTimelineEntry(
    @Param("complaintId") complaintId: string,
    @Body() dto: AddTimelineEntryDto,
    @CurrentUser("userId") userId: string,
  ) {
    const data = await this.service.addTimelineEntry(complaintId, dto, userId);
    return { success: true, message: "Timeline entry added", data };
  }
}

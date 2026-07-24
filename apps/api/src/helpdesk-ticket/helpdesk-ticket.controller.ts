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
import { HelpdeskTicketService } from "./helpdesk-ticket.service";
import { CreateHelpdeskTicketDto } from "./dto/create-helpdesk-ticket.dto";
import { UpdateHelpdeskTicketDto } from "./dto/update-helpdesk-ticket.dto";
import { AddHelpdeskTimelineEntryDto } from "./dto/add-helpdesk-timeline-entry.dto";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { ZodValidationPipe } from "../zod-validation.pipe";
import { TenantGuard } from "../auth/guards/tenant.guard";
import { UserRoles, UserRole } from "@repo/schema";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import {
  ApiCreateHelpdeskTicket,
  ApiGetHelpdeskTickets,
  ApiGetHelpdeskTicket,
  ApiUpdateHelpdeskTicket,
  ApiDeleteHelpdeskTicket,
  ApiAddHelpdeskTimelineEntry,
  ApiResolveHelpdeskTicket,
} from "./helpdesk-ticket.docs";

@ApiTags("helpdesk-tickets")
@Controller("helpdesk-tickets")
@UseGuards(JwtGuard, RolesGuard, TenantGuard)
@UsePipes(new ZodValidationPipe())
export class HelpdeskTicketController {
  constructor(private readonly service: HelpdeskTicketService) {}

  @Post()
  @Roles(UserRoles.ADMIN, UserRoles.RESIDENTS)
  @ApiCreateHelpdeskTicket()
  async create(
    @Body() dto: CreateHelpdeskTicketDto,
    @CurrentUser("societyId") societyId: string,
    @CurrentUser("userId") userId: string,
  ) {
    const data = await this.service.create(dto, societyId, userId);
    return { success: true, message: "Ticket submitted successfully", data };
  }

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiGetHelpdeskTickets()
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

  @Get(":ticketId")
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiGetHelpdeskTicket()
  async findOne(@Param("ticketId") ticketId: string) {
    const data = await this.service.findOne(ticketId);
    return { success: true, data };
  }

  @Patch(":ticketId")
  @Roles(UserRoles.ADMIN)
  @ApiUpdateHelpdeskTicket()
  async update(
    @Param("ticketId") ticketId: string,
    @Body() dto: UpdateHelpdeskTicketDto,
    @CurrentUser("userId") userId: string,
    @CurrentUser("role") role: UserRole,
  ) {
    const data = await this.service.update(ticketId, dto, userId, role);
    return { success: true, message: "Ticket updated successfully", data };
  }

  @Delete(":ticketId")
  @Roles(UserRoles.ADMIN)
  @ApiDeleteHelpdeskTicket()
  async remove(
    @Param("ticketId") ticketId: string,
    @CurrentUser("role") role: UserRole,
  ) {
    await this.service.remove(ticketId, role);
    return { success: true, message: "Ticket deleted successfully" };
  }

  @Post(":ticketId/timeline")
  @Roles(UserRoles.ADMIN, UserRoles.GUARD, UserRoles.RESIDENTS)
  @ApiAddHelpdeskTimelineEntry()
  async addTimelineEntry(
    @Param("ticketId") ticketId: string,
    @Body() dto: AddHelpdeskTimelineEntryDto,
    @CurrentUser("userId") userId: string,
  ) {
    const data = await this.service.addTimelineEntry(ticketId, dto, userId);
    return { success: true, message: "Timeline entry added", data };
  }

  @Post(":ticketId/resolve")
  @Roles(UserRoles.ADMIN, UserRoles.RESIDENTS)
  @ApiResolveHelpdeskTicket()
  async resolve(
    @Param("ticketId") ticketId: string,
    @CurrentUser("userId") userId: string,
    @CurrentUser("role") role: UserRole,
  ) {
    const data = await this.service.resolve(ticketId, userId, role);
    return { success: true, message: "Ticket resolved successfully", data };
  }
}

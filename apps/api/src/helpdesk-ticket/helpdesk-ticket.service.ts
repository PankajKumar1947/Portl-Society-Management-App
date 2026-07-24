import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { HelpdeskTicketRepository } from "./helpdesk-ticket.repository";
import { HelpdeskTicketDocument } from "./entities/helpdesk-ticket.entity";
import { CreateHelpdeskTicketDto } from "./dto/create-helpdesk-ticket.dto";
import { UpdateHelpdeskTicketDto } from "./dto/update-helpdesk-ticket.dto";
import { AddHelpdeskTimelineEntryDto } from "./dto/add-helpdesk-timeline-entry.dto";
import { UserRoles, UserRole, HelpdeskTicketFilterOptions, TICKET_STATUS } from "@repo/schema";

@Injectable()
export class HelpdeskTicketService {
  constructor(private readonly repository: HelpdeskTicketRepository) { }

  private isAdminRole(role: UserRole): boolean {
    return role === UserRoles.ADMIN || role === UserRoles.SUPER_ADMIN;
  }

  async create(
    dto: CreateHelpdeskTicketDto,
    societyId: string,
    userId: string,
  ): Promise<HelpdeskTicketDocument> {
    const timeline = [
      {
        title: "Ticket Created",
        description: "Support ticket has been created successfully.",
        status: TICKET_STATUS.OPEN,
        updatedBy: userId,
        createdAt: new Date().toISOString(),
      },
    ];

    const data = {
      category: dto.category,
      subject: dto.subject,
      description: dto.description,
      societyId,
      reportedBy: userId,
      timeline,
    };

    const doc = await this.repository.create(data);
    const ticket = await this.repository.findOne(doc.ticketId);
    if (!ticket) {
      throw new NotFoundException("Ticket creation failed");
    }
    return ticket;
  }

  async findAll(
    societyId: string,
    role: UserRole,
    query?: HelpdeskTicketFilterOptions,
  ): Promise<HelpdeskTicketDocument[]> {
    const filter: Record<string, unknown> = { societyId };

    if (!this.isAdminRole(role)) {
      if (role === UserRoles.RESIDENTS && query?.userId) {
        filter.reportedBy = query.userId;
      }
    }

    if (query?.status && query.status !== "all") {
      filter.status = query.status;
    }

    if (query?.category && query.category !== "all") {
      filter.category = query.category;
    }

    let tickets = await this.repository.find(filter);

    if (query?.search) {
      const term = query.search.toLowerCase();
      tickets = tickets.filter(
        (t) =>
          t.subject.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term),
      );
    }

    return tickets;
  }

  async findOne(ticketId: string): Promise<HelpdeskTicketDocument> {
    const ticket = await this.repository.findOne(ticketId);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID "${ticketId}" not found`);
    }
    return ticket;
  }

  async update(
    ticketId: string,
    dto: UpdateHelpdeskTicketDto,
    userId: string,
    role: UserRole,
  ): Promise<HelpdeskTicketDocument> {
    const ticket = await this.findOne(ticketId);

    if (!this.isAdminRole(role)) {
      throw new ForbiddenException("Only admins can update tickets");
    }

    const updateData: Record<string, unknown> = { ...dto };

    if (dto.status && dto.status !== ticket.status) {
      updateData.timeline = [
        ...(ticket.timeline || []),
        {
          title: `Status changed to ${dto.status.replace(/_/g, " ")}`,
          description: `Ticket status updated from ${ticket.status} to ${dto.status}.`,
          status: dto.status,
          updatedBy: userId,
          createdAt: new Date().toISOString(),
        },
      ];
    }

    const updated = await this.repository.update(ticketId, updateData);
    if (!updated) {
      throw new NotFoundException(`Ticket with ID "${ticketId}" not found for update`);
    }
    return updated;
  }

  async remove(ticketId: string, role: UserRole): Promise<void> {
    if (!this.isAdminRole(role)) {
      throw new ForbiddenException("Only admins can delete tickets");
    }
    await this.findOne(ticketId);
    await this.repository.remove(ticketId);
  }

  async addTimelineEntry(
    ticketId: string,
    dto: AddHelpdeskTimelineEntryDto,
    userId: string,
  ): Promise<HelpdeskTicketDocument> {
    const ticket = await this.findOne(ticketId);

    const entry = {
      title: dto.title,
      description: dto.description,
      status: ticket.status,
      updatedBy: userId,
      createdAt: new Date().toISOString(),
    };

    const updated = await this.repository.update(ticketId, {
      timeline: [...(ticket.timeline || []), entry],
    });

    if (!updated) {
      throw new NotFoundException(`Ticket with ID "${ticketId}" not found for update`);
    }
    return updated;
  }

  async resolve(
    ticketId: string,
    userId: string,
    role: UserRole,
  ): Promise<HelpdeskTicketDocument> {
    const ticket = await this.findOne(ticketId);

    if (!this.isAdminRole(role) && ticket.reportedBy !== userId) {
      throw new ForbiddenException("You can only resolve your own tickets");
    }

    if (ticket.status === TICKET_STATUS.RESOLVED || ticket.status === TICKET_STATUS.REJECTED) {
      throw new ForbiddenException("Ticket is already resolved or rejected");
    }

    const timeline = [
      ...(ticket.timeline || []),
      {
        title: "Ticket Resolved",
        description: "Ticket has been marked as resolved.",
        status: TICKET_STATUS.RESOLVED,
        updatedBy: userId,
        createdAt: new Date().toISOString(),
      },
    ];

    const updated = await this.repository.update(ticketId, {
      status: TICKET_STATUS.RESOLVED,
      timeline,
    });

    if (!updated) {
      throw new NotFoundException(`Ticket with ID "${ticketId}" not found for update`);
    }
    return updated;
  }
}

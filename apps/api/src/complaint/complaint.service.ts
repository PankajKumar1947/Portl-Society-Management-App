import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { ComplaintRepository } from "./complaint.repository";
import { ComplaintDocument } from "./entities/complaint.entity";
import { CreateComplaintDto } from "./dto/create-complaint.dto";
import { UpdateComplaintDto } from "./dto/update-complaint.dto";
import { AddTimelineEntryDto } from "./dto/add-timeline-entry.dto";
import { UserRoles, UserRole, ComplaintFilterOptions, COMPLAINT_STATUS, COMPLAINT_PRIORITY } from "@repo/schema";

@Injectable()
export class ComplaintService {
  constructor(private readonly repository: ComplaintRepository) { }

  private isAdminRole(role: UserRole): boolean {
    return role === UserRoles.ADMIN || role === UserRoles.SUPER_ADMIN;
  }

  async create(
    dto: CreateComplaintDto,
    societyId: string,
    userId: string,
  ): Promise<ComplaintDocument> {
    const timeline = [
      {
        title: "Complaint Registered",
        description: "Complaint successfully lodged.",
        status: COMPLAINT_STATUS.PENDING,
        updatedBy: userId,
        createdAt: new Date().toISOString(),
      },
    ];

    const data = {
      category: dto.category,
      subject: dto.subject,
      description: dto.description,
      priority: dto.priority || COMPLAINT_PRIORITY.MEDIUM,
      societyId,
      reportedBy: userId,
      towerIds: dto.towerIds || [],
      flatId: dto.flatId,
      unitNumber: dto.unitNumber,
      timeline,
    };

    const doc = await this.repository.create(data);
    const complaint = await this.repository.findOne(doc.complaintId);
    if (!complaint) {
      throw new NotFoundException("Complaint creation failed");
    }
    return complaint;
  }

  async findAll(
    societyId: string,
    role: UserRole,
    query?: ComplaintFilterOptions,
  ): Promise<ComplaintDocument[]> {
    const filter: Record<string, unknown> = { societyId };

    if (!this.isAdminRole(role)) {
      if (role === UserRoles.RESIDENTS && query?.userId) {
        filter.reportedBy = query.userId;
      } else if (role === UserRoles.GUARD) {
        filter.status = COMPLAINT_STATUS.IN_PROGRESS;
      }
    }

    if (query?.status && query.status !== "all") {
      filter.status = query.status;
    }

    if (query?.category && query.category !== "all") {
      filter.category = query.category;
    }

    let complaints = await this.repository.find(filter);

    if (query?.search) {
      const term = query.search.toLowerCase();
      complaints = complaints.filter(
        (c) =>
          c.subject.toLowerCase().includes(term) ||
          c.description.toLowerCase().includes(term),
      );
    }

    return complaints;
  }

  async findOne(complaintId: string): Promise<ComplaintDocument> {
    const complaint = await this.repository.findOne(complaintId);
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID "${complaintId}" not found`);
    }
    return complaint;
  }

  async update(
    complaintId: string,
    dto: UpdateComplaintDto,
    userId: string,
    role: UserRole,
  ): Promise<ComplaintDocument> {
    const complaint = await this.findOne(complaintId);

    if (!this.isAdminRole(role)) {
      throw new ForbiddenException("Only admins can update complaints");
    }

    const updateData: Record<string, unknown> = { ...dto };

    if (dto.status && dto.status !== complaint.status) {
      updateData.timeline = [
        ...(complaint.timeline || []),
        {
          title: `Status changed to ${dto.status.replace(/_/g, " ")}`,
          description: `Complaint status updated from ${complaint.status} to ${dto.status}.`,
          status: dto.status,
          updatedBy: userId,
          createdAt: new Date().toISOString(),
        },
      ];
    }

    const updated = await this.repository.update(complaintId, updateData);
    if (!updated) {
      throw new NotFoundException(`Complaint with ID "${complaintId}" not found for update`);
    }
    return updated;
  }

  async remove(complaintId: string, role: UserRole): Promise<void> {
    if (!this.isAdminRole(role)) {
      throw new ForbiddenException("Only admins can delete complaints");
    }
    await this.findOne(complaintId);
    await this.repository.remove(complaintId);
  }

  async addTimelineEntry(
    complaintId: string,
    dto: AddTimelineEntryDto,
    userId: string,
  ): Promise<ComplaintDocument> {
    const complaint = await this.findOne(complaintId);

    const entry = {
      title: dto.title,
      description: dto.description,
      status: complaint.status,
      updatedBy: userId,
      createdAt: new Date().toISOString(),
    };

    const updated = await this.repository.update(complaintId, {
      timeline: [...(complaint.timeline || []), entry],
    });

    if (!updated) {
      throw new NotFoundException(`Complaint with ID "${complaintId}" not found for update`);
    }
    return updated;
  }
}

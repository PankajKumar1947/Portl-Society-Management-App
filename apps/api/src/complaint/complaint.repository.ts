import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Complaint, ComplaintDocument } from "./entities/complaint.entity";

@Injectable()
export class ComplaintRepository {
  constructor(
    @InjectModel(Complaint.name)
    private readonly model: Model<ComplaintDocument>,
  ) {}

  async create(data: Record<string, unknown>): Promise<ComplaintDocument> {
    const created = new this.model(data);
    return created.save();
  }

  async find(filter: Record<string, unknown>): Promise<ComplaintDocument[]> {
    return this.model
      .find(filter)
      .populate("reportedByUser")
      .populate("assignedToUser")
      .populate("attachmentFiles")
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(complaintId: string): Promise<ComplaintDocument | null> {
    return this.model
      .findOne({ complaintId })
      .populate("reportedByUser")
      .populate("assignedToUser")
      .populate("attachmentFiles")
      .exec();
  }

  async update(
    complaintId: string,
    data: Record<string, unknown>,
  ): Promise<ComplaintDocument | null> {
    return this.model
      .findOneAndUpdate({ complaintId }, { $set: data }, { new: true })
      .populate("reportedByUser")
      .populate("assignedToUser")
      .populate("attachmentFiles")
      .exec();
  }

  async remove(complaintId: string): Promise<boolean> {
    const result = await this.model.deleteOne({ complaintId }).exec();
    return result.deletedCount > 0;
  }
}

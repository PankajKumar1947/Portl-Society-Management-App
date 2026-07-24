import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HelpdeskTicket, HelpdeskTicketDocument } from "./entities/helpdesk-ticket.entity";

@Injectable()
export class HelpdeskTicketRepository {
  constructor(
    @InjectModel(HelpdeskTicket.name)
    private readonly model: Model<HelpdeskTicketDocument>,
  ) {}

  async create(data: Record<string, unknown>): Promise<HelpdeskTicketDocument> {
    const created = new this.model(data);
    return created.save();
  }

  async find(filter: Record<string, unknown>): Promise<HelpdeskTicketDocument[]> {
    return this.model
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(ticketId: string): Promise<HelpdeskTicketDocument | null> {
    return this.model
      .findOne({ ticketId })
      .exec();
  }

  async update(
    ticketId: string,
    data: Record<string, unknown>,
  ): Promise<HelpdeskTicketDocument | null> {
    return this.model
      .findOneAndUpdate({ ticketId }, { $set: data }, { returnDocument: 'after' })
      .exec();
  }

  async remove(ticketId: string): Promise<boolean> {
    const result = await this.model.deleteOne({ ticketId }).exec();
    return result.deletedCount > 0;
  }
}

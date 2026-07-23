import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AmenityFilterOptions } from "@repo/schema";
import { Amenity, AmenityDocument } from "./entities/amenity.entity";

@Injectable()
export class AmenityRepository {
  constructor(
    @InjectModel(Amenity.name)
    private readonly model: Model<AmenityDocument>,
  ) {}

  async create(data: Partial<Amenity>): Promise<AmenityDocument> {
    const created = new this.model(data);
    return created.save();
  }

  async findBySociety(societyId: string): Promise<AmenityDocument[]> {
    return this.model
      .find({ societyId })
      .populate("thumbnailFile")
      .populate("galleryFiles")
      .exec();
  }

  async findBySocietyWithFilters(
    societyId: string,
    filters?: AmenityFilterOptions,
  ): Promise<AmenityDocument[]> {
    const query: Record<string, unknown> = { societyId };

    if (filters?.category && filters.category !== "all") {
      query.category = filters.category;
    }

    if (filters?.type && filters.type !== "all") {
      query.type = filters.type;
    }

    if (filters?.status && filters.status !== "all") {
      query.status = filters.status;
    }

    if (filters?.towerIds && filters.towerIds.length > 0) {
      query.towerIds = { $in: filters.towerIds };
    }

    if (filters?.search) {
      const term = filters.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { name: { $regex: term, $options: "i" } },
        { location: { $regex: term, $options: "i" } },
      ];
    }

    return this.model
      .find(query)
      .populate("thumbnailFile")
      .populate("galleryFiles")
      .exec();
  }

  async findById(amenityId: string, societyId: string): Promise<AmenityDocument | null> {
    return this.model
      .findOne({ amenityId, societyId })
      .populate("thumbnailFile")
      .populate("galleryFiles")
      .exec();
  }

  async update(
    amenityId: string,
    societyId: string,
    data: Partial<Amenity>,
  ): Promise<AmenityDocument | null> {
    return this.model
      .findOneAndUpdate({ amenityId, societyId }, { $set: data }, { new: true })
      .populate("thumbnailFile")
      .populate("galleryFiles")
      .exec();
  }

  async delete(amenityId: string, societyId: string): Promise<boolean> {
    const result = await this.model.deleteOne({ amenityId, societyId }).exec();
    return result.deletedCount > 0;
  }
}

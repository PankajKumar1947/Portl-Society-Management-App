import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
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

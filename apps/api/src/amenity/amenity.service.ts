import { Injectable, NotFoundException } from "@nestjs/common";
import { AmenityRepository } from "./amenity.repository";
import { CreateAmenityDto } from "./dto/create-amenity.dto";
import { UpdateAmenityDto } from "./dto/update-amenity.dto";
import { AmenityDocument } from "./entities/amenity.entity";

@Injectable()
export class AmenityService {
  constructor(private readonly repository: AmenityRepository) {}

  async create(societyId: string, dto: CreateAmenityDto): Promise<AmenityDocument> {
    return this.repository.create({
      ...dto,
      societyId,
    });
  }

  async findAll(societyId: string): Promise<AmenityDocument[]> {
    return this.repository.findBySociety(societyId);
  }

  async findOne(amenityId: string, societyId: string): Promise<AmenityDocument> {
    const amenity = await this.repository.findById(amenityId, societyId);
    if (!amenity) {
      throw new NotFoundException(`Amenity with ID "${amenityId}" not found`);
    }
    return amenity;
  }

  async update(
    amenityId: string,
    societyId: string,
    dto: UpdateAmenityDto,
  ): Promise<AmenityDocument> {
    await this.findOne(amenityId, societyId);
    const updated = await this.repository.update(amenityId, societyId, dto);
    if (!updated) {
      throw new NotFoundException(`Amenity with ID "${amenityId}" not found for update`);
    }
    return updated;
  }

  async remove(amenityId: string, societyId: string): Promise<{ success: boolean }> {
    await this.findOne(amenityId, societyId);
    const deleted = await this.repository.delete(amenityId, societyId);
    return { success: deleted };
  }
}

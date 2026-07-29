import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resident, ResidentDocument } from './entities/resident.entity';
import { Vehicle, VehicleDocument } from './entities/vehicle.entity';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { ResidentAllotmentDto } from './dto/resident-allotment.dto';

@Injectable()
export class ResidentRepository {
  constructor(
    @InjectModel(Resident.name)
    private readonly model: Model<ResidentDocument>,
    @InjectModel(Vehicle.name)
    public readonly vehicleModel: Model<VehicleDocument>,
  ) {}

  private readonly populateFields = [
    { path: 'userDetails', select: 'userId firstName lastName email phoneNumber' },
    { path: 'vehicles' },
    { path: 'flat', select: 'flatId flatNumber' },
    { path: 'tower', select: 'towerId towerName' },
  ];

  async create(dto: CreateResidentDto | ResidentAllotmentDto): Promise<ResidentDocument> {
    const created = new this.model(dto);
    return created.save();
  }

  async find(filter: Record<string, any>): Promise<ResidentDocument[]> {
    return this.model.find(filter).populate(this.populateFields).sort({ createdAt: -1 }).exec();
  }

  async findOne(residentId: string): Promise<ResidentDocument | null> {
    return this.model.findOne({ residentId }).populate(this.populateFields).exec();
  }

  async findByUserId(userId: string, societyId: string): Promise<ResidentDocument | null> {
    return this.model.findOne({ userId, societyId }).populate(this.populateFields).exec();
  }

  async update(
    residentId: string,
    dto: UpdateResidentDto,
  ): Promise<ResidentDocument | null> {
    return this.model
      .findOneAndUpdate({ residentId }, dto, { returnDocument: "after" })
      .populate(this.populateFields)
      .exec();
  }

  async remove(residentId: string): Promise<ResidentDocument | null> {
    // Delete associated vehicles first
    await this.vehicleModel.deleteMany({ residentId }).exec();
    return this.model.findOneAndDelete({ residentId }).exec();
  }
}

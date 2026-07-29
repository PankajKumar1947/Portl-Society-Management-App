import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FamilyMember, FamilyMemberDocument } from './entities/family-member.entity';

@Injectable()
export class FamilyMemberRepository {
  constructor(
    @InjectModel(FamilyMember.name)
    private readonly model: Model<FamilyMemberDocument>,
  ) {}

  private readonly populateFields = [
    { path: 'flat', select: 'flatId flatNumber' },
    { path: 'tower', select: 'towerId towerName' },
  ];

  async create(data: Partial<FamilyMember>): Promise<FamilyMemberDocument> {
    const created = new this.model(data);
    return created.save();
  }

  async find(filter: Record<string, unknown>): Promise<FamilyMemberDocument[]> {
    return this.model.find(filter).populate(this.populateFields).sort({ createdAt: -1 }).exec();
  }

  async findOne(familyMemberId: string): Promise<FamilyMemberDocument | null> {
    return this.model.findOne({ familyMemberId }).populate(this.populateFields).exec();
  }

  async remove(familyMemberId: string): Promise<FamilyMemberDocument | null> {
    return this.model.findOneAndDelete({ familyMemberId }).exec();
  }
}

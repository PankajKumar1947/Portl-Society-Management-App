import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Society, SocietyDocument } from './entities/society.entity';
import { CreateSocietyDto } from './dto/create-society.dto';
import { UpdateSocietyDto } from './dto/update-society.dto';
import { Tower, TowerDocument } from '../tower/entities/tower.entity';
import { Flat, FlatDocument } from '../flat/entities/flat.entity';
import { Resident, ResidentDocument } from '../resident/entities/resident.entity';
import { Guard, GuardDocument } from '../guard/entities/guard.entity';
import { Vehicle, VehicleDocument } from '../resident/entities/vehicle.entity';
import { Notice, NoticeDocument } from '../notice/entities/notice.entity';
import { Poll, PollDocument } from '../poll/entities/poll.entity';
import { Complaint, ComplaintDocument } from '../complaint/entities/complaint.entity';
import { SocietyStats } from '@repo/schema';

@Injectable()
export class SocietyRepository {
  constructor(
    @InjectModel(Society.name)
    public readonly societyModel: Model<SocietyDocument>,
    @InjectModel(Tower.name)
    private readonly towerModel: Model<TowerDocument>,
    @InjectModel(Flat.name)
    private readonly flatModel: Model<FlatDocument>,
    @InjectModel(Resident.name)
    private readonly residentModel: Model<ResidentDocument>,
    @InjectModel(Guard.name)
    private readonly guardModel: Model<GuardDocument>,
    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<VehicleDocument>,
    @InjectModel(Notice.name)
    private readonly noticeModel: Model<NoticeDocument>,
    @InjectModel(Poll.name)
    private readonly pollModel: Model<PollDocument>,
    @InjectModel(Complaint.name)
    private readonly complaintModel: Model<ComplaintDocument>,
  ) {}

  async create(
    createSocietyDto: CreateSocietyDto & {
      userId: string;
    },
  ): Promise<SocietyDocument> {
    const createdSociety = new this.societyModel(createSocietyDto);
    return createdSociety.save();
  }

  async findOne(societyId: string): Promise<SocietyDocument | null> {
    return this.societyModel.findOne({ societyId }).exec();
  }

  async findByCode(societyCode: string): Promise<SocietyDocument | null> {
    return this.societyModel.findOne({ societyCode }).exec();
  }

  async findByUserId(userId: string): Promise<SocietyDocument | null> {
    return this.societyModel.findOne({ userId }).exec();
  }

  async update(
    societyId: string,
    updateSocietyDto: UpdateSocietyDto,
  ): Promise<SocietyDocument | null> {
    return this.societyModel
      .findOneAndUpdate({ societyId }, updateSocietyDto, { returnDocument: "after" })
      .exec();
  }

  async getStats(societyId: string): Promise<SocietyStats> {
    const [towers, flats, residents, guards, vehicles, notices, polls, complaints] =
      await Promise.all([
        this.towerModel.countDocuments({ societyId }),
        this.flatModel.countDocuments({ societyId }),
        this.residentModel.countDocuments({ societyId }),
        this.guardModel.countDocuments({ societyId }),
        this.vehicleModel.countDocuments({ societyId }),
        this.noticeModel.countDocuments({ societyId }),
        this.pollModel.countDocuments({ societyId }),
        this.complaintModel.countDocuments({ societyId }),
      ]);

    return { towers, flats, residents, guards, vehicles, notices, polls, complaints };
  }
}

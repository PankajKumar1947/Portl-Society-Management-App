import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from './entities/otp.entity';

@Injectable()
export class OtpRepository {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
  ) {}

  async findOne(email: string): Promise<OtpDocument | null> {
    return this.otpModel.findOne({ email }).exec();
  }

  async saveOtp(
    email: string,
    hashedCode: string,
    expiresAt: Date,
  ): Promise<OtpDocument> {
    // Delete any old OTPs for this email first
    await this.deleteMany(email);

    const otpRecord = new this.otpModel({
      email,
      code: hashedCode,
      expiresAt,
    });
    return otpRecord.save();
  }

  async deleteMany(email: string): Promise<void> {
    await this.otpModel.deleteMany({ email }).exec();
  }

  async deleteOne(id: string): Promise<void> {
    await this.otpModel.deleteOne({ _id: id }).exec();
  }
}

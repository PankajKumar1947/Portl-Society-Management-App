import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ResidentRepository } from './resident.repository';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { ResidentDocument } from './entities/resident.entity';
import { UserService } from '../user/user.service';
import { ResidentPersonalDto } from './dto/resident-personal.dto';
import { ResidentAllotmentDto } from './dto/resident-allotment.dto';
import { ResidentVehicleDto } from './dto/resident-vehicle.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ResidentService {
  constructor(
    private readonly repository: ResidentRepository,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  async onboardPersonal(
    dto: ResidentPersonalDto,
    societyId: string,
  ): Promise<any> {
    const existingUser = await this.userService.userRepository.findOne(dto.email);
    if (existingUser) {
      const residents = await this.repository.find({ userId: existingUser.userId });
      if (residents.length > 0) {
        throw new ConflictException('User with this email already exists and is fully onboarded');
      }

      await this.authService.triggerOtpVerification(dto.email);

      return {
        userId: existingUser.userId,
        email: existingUser.email,
      };
    }

    const phonePrefix = dto.mobileNumber.slice(0, 4);
    const password = `${dto.email}@${phonePrefix}`;

    const user = await this.userService.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phoneNumber: dto.mobileNumber,
      role: 'RESIDENTS',
      password,
      societyId,
    });

    await this.authService.triggerOtpVerification(dto.email);

    return {
      userId: user.userId,
      email: user.email,
    };
  }

  async onboardAllotment(
    societyId: string,
    dto: ResidentAllotmentDto,
  ): Promise<ResidentDocument> {
    const data = {
      societyId,
      userId: dto.userId,
      residentType: dto.residentType,
      relationship: dto.relationship || undefined,
      towerId: dto.towerId,
      flatNumber: dto.flatNumber,
      moveInDate: dto.moveInDate,
      ownershipStatus: dto.ownershipStatus,
      isPrimary: dto.isPrimary,
      docType: dto.docType,
      documentNumber: dto.documentNumber || undefined,
    };
    return this.repository.create(data);
  }

  async onboardVehicle(
    residentId: string,
    dto: ResidentVehicleDto,
  ): Promise<ResidentDocument> {
    const data = {
      vehicleType: dto.vehicleType,
      vehicleNumber: dto.vehicleNumber,
      vehicleBrand: dto.vehicleBrand,
      vehicleModel: dto.vehicleModel,
      vehicleColor: dto.vehicleColor,
      parkingSlot: dto.parkingSlot,
    };
    const resident = await this.repository.update(residentId, data);
    if (!resident) {
      throw new NotFoundException(`Resident with ID "${residentId}" not found`);
    }
    return resident;
  }

  async create(dto: CreateResidentDto): Promise<ResidentDocument> {
    return this.repository.create(dto);
  }

  async findAll(
    societyId: string,
    query?: { type?: string; search?: string },
  ): Promise<ResidentDocument[]> {
    const filter: Record<string, any> = { societyId };

    if (query?.type && query.type !== 'ALL') {
      filter.residentType = query.type;
    }

    if (query?.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { flatNumber: searchRegex },
        { mobileNumber: searchRegex },
      ];
    }

    return this.repository.find(filter);
  }

  async findOne(residentId: string): Promise<ResidentDocument> {
    const resident = await this.repository.findOne(residentId);
    if (!resident) {
      throw new NotFoundException(`Resident with ID "${residentId}" not found`);
    }
    return resident;
  }

  async update(
    residentId: string,
    dto: UpdateResidentDto,
  ): Promise<ResidentDocument> {
    const resident = await this.repository.update(residentId, dto);
    if (!resident) {
      throw new NotFoundException(`Resident with ID "${residentId}" not found`);
    }
    return resident;
  }

  async remove(residentId: string): Promise<void> {
    const resident = await this.repository.remove(residentId);
    if (!resident) {
      throw new NotFoundException(`Resident with ID "${residentId}" not found`);
    }
  }
}

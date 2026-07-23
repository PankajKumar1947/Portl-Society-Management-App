import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { GuardRepository } from './guard.repository';
import { GuardDocument } from './entities/guard.entity';
import { UserService } from '../user/user.service';
import { UpdateGuardDto } from './dto/update-guard.dto';
import { OnboardGuardPersonalDto } from './dto/onboard-guard-personal.dto';
import { OnboardGuardDutyDto } from './dto/onboard-guard-duty.dto';
import { AuthService } from '../auth/auth.service';
import { UserRoles, GuardData } from '@repo/schema';

@Injectable()
export class GuardService {
  constructor(
    private readonly repository: GuardRepository,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async onboardPersonal(
    dto: OnboardGuardPersonalDto,
    societyId: string,
  ): Promise<{ userId: string; email: string }> {
    const existingUser = await this.userService.userRepository.findOne(dto.email);
    if (existingUser) {
      if (existingUser.role !== UserRoles.GUARD) {
        throw new ConflictException('User with this email already exists');
      }

      const guards = await this.repository.find({ userId: existingUser.userId });
      if (guards.length > 0) {
        throw new ConflictException('User with this email already exists and is fully onboarded');
      }

      await this.authService.triggerOtpVerification(dto.email);

      return {
        userId: existingUser.userId,
        email: existingUser.email,
      };
    }

    const phonePrefix = dto.phoneNumber.slice(0, 4);
    const password = `${dto.email}@${phonePrefix}`;

    const user = await this.userService.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      role: UserRoles.GUARD,
      password,
      societyId,
    });

    await this.authService.triggerOtpVerification(dto.email);

    return {
      userId: user.userId,
      email: user.email,
    };
  }

  async onboardDuty(
    dto: OnboardGuardDutyDto,
    societyId: string,
  ): Promise<GuardDocument> {
    const existingGuard = await this.repository.find({ userId: dto.userId });
    if (existingGuard.length > 0) {
      throw new ConflictException('Guard is already onboarded');
    }

    const guard = await this.repository.create({
      userId: dto.userId,
      societyId,
      shiftType: dto.shiftType,
      gateNumber: dto.gateNumber,
      agencyName: dto.agencyName,
      status: 'ACTIVE',
    });

    const populated = await this.repository.findOne(guard.guardId);
    if (!populated) {
      throw new NotFoundException('Guard was not successfully registered.');
    }
    return populated;
  }

  async findAll(
    societyId: string,
    query?: { type?: string; search?: string },
  ): Promise<GuardDocument[]> {
    const filter: Record<string, any> = { societyId };

    if (query?.type && query.type !== 'ALL') {
      filter.shiftType = query.type;
    }

    if (query?.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { gateNumber: searchRegex },
      ];
    }

    // Handled populated joins in repository
    let guards = await this.repository.find(filter);

    // Apply client-side text searches on populated User fields
    if (query?.search) {
      const searchLower = query.search.toLowerCase();
      guards = guards.filter((g) => {
        const details = (g as unknown as GuardData).userDetails;
        const first = details?.firstName?.toLowerCase() || '';
        const last = details?.lastName?.toLowerCase() || '';
        const phone = details?.phoneNumber || '';
        return (
          first.includes(searchLower) ||
          last.includes(searchLower) ||
          phone.includes(searchLower) ||
          g.gateNumber.toLowerCase().includes(searchLower)
        );
      });
    }

    return guards;
  }

  async findOne(guardId: string): Promise<GuardDocument> {
    const guard = await this.repository.findOne(guardId);
    if (!guard) {
      throw new NotFoundException(`Guard with ID "${guardId}" not found`);
    }
    return guard;
  }

  async update(
    guardId: string,
    dto: UpdateGuardDto,
  ): Promise<GuardDocument> {
    const guard = await this.repository.findOne(guardId);
    if (!guard) {
      throw new NotFoundException(`Guard with ID "${guardId}" not found`);
    }

    // 1. Update Core User Details if present
    if (dto.firstName || dto.lastName || dto.phoneNumber || dto.email) {
      await this.userService.userRepository.userModel.findOneAndUpdate(
        { userId: guard.userId },
        {
          ...(dto.firstName ? { firstName: dto.firstName } : {}),
          ...(dto.lastName ? { lastName: dto.lastName } : {}),
          ...(dto.phoneNumber ? { phoneNumber: dto.phoneNumber } : {}),
          ...(dto.email ? { email: dto.email } : {}),
        },
      ).exec();
    }

    // 2. Update Guard specific fields
    const updated = await this.repository.update(guardId, dto);
    if (!updated) {
      throw new NotFoundException(`Guard with ID "${guardId}" not found after update`);
    }
    return updated;
  }

  async remove(guardId: string): Promise<GuardDocument> {
    const guard = await this.repository.findOne(guardId);
    if (!guard) {
      throw new NotFoundException(`Guard with ID "${guardId}" not found`);
    }

    // Delete core user credentials first
    await this.userService.userRepository.userModel.findOneAndDelete({ userId: guard.userId }).exec();
    await this.repository.remove(guardId);
    return guard;
  }
}

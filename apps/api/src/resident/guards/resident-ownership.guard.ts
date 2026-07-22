import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SocietyRepository } from '../../society/society.repository';
import { ResidentRepository } from '../resident.repository';
import { TokenPayload } from '../../shared/token/token.service';
import { UserRoles } from '@repo/schema';

@Injectable()
export class ResidentOwnershipGuard implements CanActivate {
  constructor(
    private readonly societyRepository: SocietyRepository,
    private readonly residentRepository: ResidentRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as TokenPayload | undefined;

    if (user?.role === UserRoles.SUPER_ADMIN) {
      return true;
    }

    let societyId = request.body?.societyId || request.query?.societyId;
    const residentId = request.params?.residentId;

    if (!societyId && residentId) {
      const resident = await this.residentRepository.findOne(residentId);
      if (!resident) {
        throw new NotFoundException(`Resident with ID "${residentId}" not found`);
      }
      societyId = resident.societyId;
    }

    if (!societyId) {
      return true;
    }

    const society = await this.societyRepository.findOne(societyId);
    if (!society) {
      throw new NotFoundException(`Society with ID "${societyId}" not found`);
    }

    if (society.userId !== user?.userId) {
      throw new ForbiddenException(
        'You do not have permission to access or modify this resource',
      );
    }

    return true;
  }
}

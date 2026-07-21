import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SocietyRepository } from '../society.repository';
import { TokenPayload } from '../../shared/token/token.service';
import { UserRoles } from '@repo/schema';

@Injectable()
export class SocietyOwnershipGuard implements CanActivate {
  constructor(private readonly societyRepository: SocietyRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as TokenPayload | undefined;
    const societyId = request.params.societyId;

    if (!societyId) {
      return true;
    }

    const society = await this.societyRepository.findOne(societyId);
    if (!society) {
      throw new NotFoundException(`Society with ID "${societyId}" not found`);
    }

    if (user?.role === UserRoles.SUPER_ADMIN) {
      return true;
    }

    if (society.userId !== user?.userId) {
      throw new ForbiddenException(
        'You do not have permission to access or modify this society',
      );
    }

    return true;
  }
}

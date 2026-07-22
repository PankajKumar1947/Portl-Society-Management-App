import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { TokenPayload } from '../../shared/token/token.service';
import { UserRoles } from '@repo/schema';

@Injectable()
export class TenantGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as TokenPayload | undefined;

    if (!user) {
      return false;
    }

    if (user.role === UserRoles.SUPER_ADMIN) {
      return true;
    }

    // Resolve target society context from body, query or user token
    const requestedSocietyId = request.body?.societyId || request.query?.societyId || user.societyId;

    if (!requestedSocietyId) {
      return true; // Let downstream endpoints assert requirements if no society context is asked
    }

    if (user.societyId && user.societyId !== requestedSocietyId) {
      throw new ForbiddenException('Access denied. Resource belongs to another society.');
    }

    return true;
  }
}

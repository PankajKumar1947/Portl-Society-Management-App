import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TokenPayload } from '../shared/token/token.service';
import { ROLE_PERMISSIONS } from './acl.constants';
import { ApiGetAcl } from './acl.docs';

@ApiTags('acl')
@Controller('acl')
@UseGuards(JwtGuard)
export class AclController {
  @Get()
  @ApiGetAcl()
  async getAcl(@CurrentUser() user: TokenPayload) {
    const permissions = ROLE_PERMISSIONS[user.role] ?? ROLE_PERMISSIONS.RESIDENTS;
    return {
      success: true,
      message: 'ACL fetched successfully',
      data: {
        role: user.role,
        resources: permissions,
      },
    };
  }
}

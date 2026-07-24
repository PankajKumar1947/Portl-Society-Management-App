import { Module } from '@nestjs/common';
import { AclController } from './acl.controller';
import { TokenModule } from 'src/shared/token/token.module';

@Module({
  imports: [TokenModule],
  controllers: [AclController],
})
export class AclModule { }

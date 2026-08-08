import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialsController } from './socials.controller';
import { SocialsService } from './socials.service';
import { SocialsRepository } from './socials.repository';
import { Post, PostSchema } from './entities/post.entity';
import { UserModule } from '../user/user.module';
import { ResidentModule } from '../resident/resident.module';
import { TokenModule } from 'src/shared/token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    TokenModule,
    UserModule,
    ResidentModule,
  ],
  controllers: [SocialsController],
  providers: [SocialsService, SocialsRepository],
  exports: [SocialsService, SocialsRepository],
})
export class SocialsModule { }

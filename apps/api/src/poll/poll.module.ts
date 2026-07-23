import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';
import { PollRepository } from './poll.repository';
import { Poll, PollSchema } from './entities/poll.entity';
import { PollVote, PollVoteSchema } from './entities/poll-vote.entity';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../shared/token/token.module';
import { ResidentModule } from '../resident/resident.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Poll.name, schema: PollSchema },
      { name: PollVote.name, schema: PollVoteSchema },
    ]),
    AuthModule,
    TokenModule,
    ResidentModule,
  ],
  controllers: [PollController],
  providers: [PollService, PollRepository],
  exports: [PollService, PollRepository],
})
export class PollModule {}

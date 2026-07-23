import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as crypto from 'crypto';

export type PollVoteDocument = HydratedDocument<PollVote>;

@Schema({
  timestamps: true,
})
export class PollVote {
  @Prop({
    required: true,
    unique: true,
    default: () => `pvt_${crypto.randomBytes(10).toString('hex')}`,
  })
  voteId: string;

  @Prop({ required: true, index: true })
  pollId: string;

  @Prop({ required: true })
  optionId: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  societyId: string;
}

export const PollVoteSchema = SchemaFactory.createForClass(PollVote);

PollVoteSchema.index({ pollId: 1, userId: 1 }, { unique: true });

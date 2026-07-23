import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { POLL_STATUSES, POLL_RECIPIENTS } from '@repo/schema';
import * as crypto from 'crypto';

export type PollDocument = HydratedDocument<Poll>;

export class PollOption {
  @Prop({ required: true })
  optionId: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true, default: 0 })
  displayOrder: number;
}


@Schema({
  timestamps: true,
})
export class Poll {
  @Prop({
    required: true,
    unique: true,
    default: () => `pol_${crypto.randomBytes(10).toString('hex')}`,
  })
  pollId: string;

  @Prop({ required: true, index: true })
  societyId: string;

  @Prop({ type: [String], default: [] })
  towerIds?: string[];

  @Prop({ required: true, type: [String], enum: POLL_RECIPIENTS })
  recipient: string[];

  @Prop({ required: true })
  question: string;

  @Prop()
  description?: string;

  @Prop({ required: true, default: 'single' })
  choiceType: string;

  @Prop({ type: [PollOption], default: [] })
  options: PollOption[];

  @Prop({ required: true, enum: POLL_STATUSES, default: 'draft' })
  status: string;

  @Prop({ required: true, index: true })
  createdBy: string;

  @Prop({ required: true })
  expiresAt: string;

  @Prop()
  publishedOn?: string;

  @Prop()
  closedOn?: string;
}

export const PollSchema = SchemaFactory.createForClass(Poll);

PollSchema.virtual('publisher', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: 'userId',
  justOne: true,
});

PollSchema.set('toJSON', { virtuals: true });
PollSchema.set('toObject', { virtuals: true });

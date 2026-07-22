import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as crypto from 'crypto';

export type TowerDocument = HydratedDocument<Tower>;

@Schema({
  timestamps: true,
})
export class Tower {
  @Prop({
    required: true,
    unique: true,
    default: () => `twr_${crypto.randomBytes(10).toString('hex')}`,
  })
  towerId!: string;

  @Prop({ required: true, index: true })
  societyId!: string;

  @Prop({ required: true })
  towerName!: string;

  @Prop()
  location?: string;

  @Prop()
  appNumber?: string;

  @Prop()
  totalFloors?: number;
}

export const TowerSchema = SchemaFactory.createForClass(Tower);
export const TowerEntity = TowerSchema;

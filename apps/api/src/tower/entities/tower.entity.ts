import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TowerDocument = HydratedDocument<Tower>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Tower {
  @Prop({ required: true, unique: true })
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

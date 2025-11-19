import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Referee extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  academyId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], default: [] })
  assignedMatches: Types.ObjectId[]; // Références vers des matches (à créer plus tard)

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const RefereeSchema = SchemaFactory.createForClass(Referee);


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Team extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string; // ex: "U10", "U12"

  @Prop({ required: true })
  coachName: string;

  @Prop({ required: true, default: 20 })
  maxPlayers: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  academyId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  players: Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TeamSchema = SchemaFactory.createForClass(Team);


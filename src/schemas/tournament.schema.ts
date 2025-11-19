import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Tournament extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string; // ex: "U10", "U12"

  @Prop({ 
    type: String, 
    enum: ['ELIMINATION', 'POINTS'], 
    required: true 
  })
  type: 'ELIMINATION' | 'POINTS';

  @Prop({ required: true })
  maxTeams: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  academyId: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: ['UPCOMING', 'ONGOING', 'FINISHED'], 
    default: 'UPCOMING' 
  })
  status: 'UPCOMING' | 'ONGOING' | 'FINISHED';

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TournamentSchema = SchemaFactory.createForClass(Tournament);


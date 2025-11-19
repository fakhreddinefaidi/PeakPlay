import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class JoinRequest extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  playerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Team', required: true })
  teamId: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'], 
    default: 'PENDING' 
  })
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const JoinRequestSchema = SchemaFactory.createForClass(JoinRequest);


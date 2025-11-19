import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Academy extends Document {
  @Prop({ required: true, unique: true })
  userId: string; // Référence vers User._id

  @Prop({ required: true })
  academyName: string;

  @Prop({ required: false })
  logoUrl?: string;

  @Prop({ required: false })
  address?: string;

  @Prop({ required: false })
  phone?: string;

  @Prop({ required: false })
  responsableName?: string;

  @Prop({ type: [String], default: [] })
  categories?: string[]; // ex: ["U10", "U12"]

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AcademySchema = SchemaFactory.createForClass(Academy);


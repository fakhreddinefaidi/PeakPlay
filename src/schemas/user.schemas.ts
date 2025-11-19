import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ required: false })
  verificationToken?: string;

  // Champs additionnels utilisés par le code
  @Prop({ required: false })
  prenom?: string;

  @Prop({ required: false })
  nom?: string;

  @Prop({ required: false })
  age?: Date;

  @Prop({ required: false })
  tel?: number;

  @Prop({ enum: ['JOUEUR', 'ACADEMY', 'ARBITRE'], default: 'JOUEUR' })
  role?: string;

  @Prop({ required: false })
  provider?: string;

  @Prop({ required: false })
  providerId?: string;

  @Prop({ required: false })
  verificationTokenExpires?: Date;

  @Prop({ required: false })
  picture?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

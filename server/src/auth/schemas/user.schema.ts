import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: [true, 'This account already exists.'] })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  linkedin: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

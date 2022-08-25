import { Schema, Types } from 'mongoose';
import { baseModel } from './base.model';

export interface userModel extends baseModel {
  name: string;
  age: number;
  department: [
    {
      _id: Types.ObjectId;
      role: number;
    },
  ];
}

export const userSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  department: [
    {
      _id: { type: Types.ObjectId, required: true, unique: true },
      role: { type: Number },
    },
  ],
});

import { Schema, Types } from 'mongoose';
import { baseModel } from './base.model';

export interface userModel extends baseModel {
  name: string;
  age: number;
  department: [
    {
      departmentId: Types.ObjectId;
      role: number;
    },
  ];
}

export const userSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  department: [
    {
      departmentId: { type: Types.ObjectId, required: true },
      role: { type: Number },
    },
  ],
});

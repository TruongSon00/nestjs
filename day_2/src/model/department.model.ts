import { Schema } from 'mongoose';
import { baseModel } from './base.model';

export interface departmentModel extends baseModel {
  name: string;
  descript: string;
}

export const departmentSchema = new Schema({
  name: { type: String, required: true },
  descript: { type: String, required: true },
});

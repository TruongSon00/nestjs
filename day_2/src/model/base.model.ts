import { Date, Mongoose } from 'mongoose';

export interface baseModel extends Mongoose {
  createdAt?: Date;
  updatedAt?: Date;
}

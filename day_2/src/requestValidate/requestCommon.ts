import { Types } from 'mongoose';

export const checkId = (id: any): any => {
  if (Types.ObjectId.isValid(id)) {
    if (new Types.ObjectId(id) != id) throw new Error('invalid id.');
  } else throw new Error('invalid id.');
};

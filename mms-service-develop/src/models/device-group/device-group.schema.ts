import { Schema } from 'mongoose';
import {
  DEVICE_GROUP_CONST,
  DeviceGroupStatusConstant,
} from '@components/device-group/device-group.constant';
import { transformId } from '../../helper/schema.helper';
import * as mongoose from 'mongoose';
import { DEFAULT_COLLATION } from '@constant/common';

export const DeviceGroupSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: DEVICE_GROUP_CONST.CODE.MAX_LENGTH,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: DEVICE_GROUP_CONST.NAME.MAX_LENGTH,
    },
    status: {
      type: Number,
      required: true,
      enum: DeviceGroupStatusConstant,
    },
    responsibleUserIds: {
      type: Number,
    },
    responsibleMaintenanceTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceTeam',
    },
    description: {
      type: String,
      maxlength: DEVICE_GROUP_CONST.DESCRIPTION.MAX_LENGTH,
    },
    histories: {
      type: [],
    },
  },
  {
    id: true,
    timestamps: true,
    collection: 'deviceGroups',
    collation: DEFAULT_COLLATION,
  },
);

transformId(DeviceGroupSchema);

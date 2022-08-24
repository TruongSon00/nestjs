import { Schema, Types } from 'mongoose';
import { DEVICE_REQUEST_CONST } from '@components/device-request/device-request.constant';
import { transformId } from '../../helper/schema.helper';
import { DEFAULT_COLLATION } from '@constant/common';

export enum DeviceReturnTicketStatus {
  AwaitingConfirmation,
  AwaitingITConfirmation,
  AwaitingReturn,
  Returned,
  Rejected,
}

export const DeviceReturnTicketSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: DEVICE_REQUEST_CONST.CODE.MAX_LENGTH,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: DEVICE_REQUEST_CONST.NAME.MAX_LENGTH,
    },
    description: {
      type: String,
      required: true,
      maxlength: DEVICE_REQUEST_CONST.DESCRIPTION.MAX_LENGTH,
    },
    status: {
      type: Number,
      enum: DeviceReturnTicketStatus,
      default: DeviceReturnTicketStatus.AwaitingConfirmation,
      required: true,
    },
    deviceAssignments: {
      type: [
        {
          type: Types.ObjectId,
          ref: 'DeviceAssignment',
        },
      ],
      required: true,
    },
    histories: {
      type: [],
    },
  },
  {
    id: true,
    timestamps: true,
    collection: 'deviceReturnTickets',
    collation: DEFAULT_COLLATION,
  },
);

transformId(DeviceReturnTicketSchema);

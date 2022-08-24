import { Schema, Types } from 'mongoose';
import { DEVICE_REQUEST_CONST } from '@components/device-request/device-request.constant';
import { transformId } from '../../helper/schema.helper';
import { DEFAULT_COLLATION } from '@constant/common';

export enum DeviceRequestTicketStatus {
  AwaitingConfirmation, // Waiting confirm
  AwaitingITConfirmation, // Waiting IT confirm
  AwaitingAssignment, // Waiting assign
  Assigned, // Assigned
  Confirmed, // Confirmed
  Rejected, // Rejected
  WaitingExport,
  Installed,
}

export const DeviceRequestTicketSchema = new Schema(
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
    workCenterId: {
      type: Number,
      required: false,
      min: 1,
    },
    userId: {
      type: Number,
      required: true,
      min: 1,
    },
    quantity: {
      type: Number,
      min: 0,
      required: false,
      default: 0,
    },
    actualImportQuantity: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      enum: DeviceRequestTicketStatus,
      default: DeviceRequestTicketStatus.AwaitingConfirmation,
      required: true,
    },
    histories: {
      type: [],
    },
    device: {
      type: Types.ObjectId,
      ref: 'Device',
      required: true,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
  },
  {
    id: true,
    timestamps: true,
    collection: DEVICE_REQUEST_CONST.REQUEST_TICKET.COLL,
    collation: DEFAULT_COLLATION,
  },
);

transformId(DeviceRequestTicketSchema);

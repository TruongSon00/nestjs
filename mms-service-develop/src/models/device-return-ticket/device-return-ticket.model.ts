import { BaseModel } from '@core/model/base.model';
import { History } from '../history/history.model';
import { DeviceReturnTicketStatus } from './device-return-ticket.schema';
import { Types } from 'mongoose';

export class DeviceReturnTicketDetail {
  deviceAssignment: Types.ObjectId;
  quantity: number;
  userId: number;
}

export interface DeviceReturnTicket extends BaseModel {
  code: string;
  name: string;
  description: string;
  status: DeviceReturnTicketStatus;
  deviceAssignments: Types.ObjectId[];
  histories: History[];
  createdAt: Date;
}

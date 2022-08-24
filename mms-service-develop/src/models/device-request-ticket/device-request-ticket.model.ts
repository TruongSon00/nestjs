import { BaseModel } from '@core/model/base.model';
import { History } from '../history/history.model';
import { Types } from 'mongoose';
import { DeviceRequestTicketStatus } from './device-request-ticket.schema';

export interface DeviceRequestTicket extends BaseModel {
  code: string;
  name: string;
  description: string;
  userId: number;
  quantity: number;
  actualImportQuantity: number;
  workCenterId: number;
  device: Types.ObjectId;
  status: DeviceRequestTicketStatus;
  histories: History[];
  createdAt: Date;
}

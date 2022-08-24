import { BaseModel } from '@core/model/base.model';
import { History } from '../history/history.model';
import { ObjectId } from 'mongoose';

export interface DeviceGroup extends BaseModel {
  code: string;
  name: string;
  responsibleUserIds: number;
  responsibleMaintenanceTeam: string;
  description: string;
  status: number;
  histories: History[];
}

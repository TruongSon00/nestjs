import { DeviceRequestTicketStatus } from '../../../../models/device-request-ticket/device-request-ticket.schema';
import { History } from '../../../../models/history/history.model';
import { BaseUserResponseDto } from '@components/user/dto/response/base.user.response.dto';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class DeviceDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;
}

export class WorkCenterDto {
  @Expose()
  id: number;

  @Expose()
  name: number;
}

export class DetailDeviceRequestTicketResponseDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  user: BaseUserResponseDto;

  @Expose()
  quantity: number;

  @Expose()
  workCenter: WorkCenterDto;

  @Expose()
  device: Types.ObjectId;

  @Expose()
  status: DeviceRequestTicketStatus;

  @Expose()
  histories: History[];
}

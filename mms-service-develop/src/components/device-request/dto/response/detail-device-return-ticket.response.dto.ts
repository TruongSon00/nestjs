import { DeviceReturnTicketStatus } from '../../../../models/device-return-ticket/device-return-ticket.schema';
import { History } from '../../../../models/history/history.model';
import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  fullName: string;
}

export class DeviceDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;
}

export class DeviceAssignmentDto {
  @Expose()
  id: string;

  @Expose()
  serial: string;

  @Expose()
  device: DeviceDto;

  @Expose()
  user: UserDto;
}

export class DetailDeviceReturnTicketResponseDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  status: DeviceReturnTicketStatus;

  @Expose()
  deviceAssignments: DeviceAssignmentDto[];

  @Expose()
  histories: History[];
}

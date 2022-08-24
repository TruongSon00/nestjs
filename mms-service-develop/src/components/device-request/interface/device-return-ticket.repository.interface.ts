import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { History } from '../../../models/history/history.model';
import { DeviceReturnTicket } from '../../../models/device-return-ticket/device-return-ticket.model';
import { DeviceReturnTicketStatus } from '../../../models/device-return-ticket/device-return-ticket.schema';
import { CreateDeviceReturnTicketRequestDto } from '@components/device-request/dto/request/return-ticket/create-device-return-ticket.request.dto';

export interface DeviceReturnTicketRepositoryInterface
  extends BaseInterfaceRepository<DeviceReturnTicket> {
  createDocument(
    request: CreateDeviceReturnTicketRequestDto,
    code: string,
  ): Promise<DeviceReturnTicket>;
  getDetail(id: string): Promise<DeviceReturnTicket>;
  update(request: any, history: History): Promise<DeviceReturnTicket>;
  changeStatus(
    id: string,
    status: DeviceReturnTicketStatus,
    history: History,
  ): Promise<string>;
  delete(id: string): Promise<DeviceReturnTicket>;
  findOneById(id: string): Promise<DeviceReturnTicket>;
  getLatest(): Promise<DeviceReturnTicket>;
  findAllWithPopulate(
    condition: any,
    populate: any,
  ): Promise<DeviceReturnTicket[]>;
}

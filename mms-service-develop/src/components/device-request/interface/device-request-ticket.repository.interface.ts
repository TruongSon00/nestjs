import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { History } from '../../../models/history/history.model';
import { DeviceRequestTicket } from '../../../models/device-request-ticket/device-request-ticket.model';
import { DeviceRequestTicketStatus } from '../../../models/device-request-ticket/device-request-ticket.schema';
import { CreateDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/create-device-request-ticket.request.dto';
import { ListDeviceRequestsRequestDto } from '@components/device-request/dto/request/list-device-requests.request.dto';

export interface DeviceRequestTicketRepositoryInterface
  extends BaseInterfaceRepository<DeviceRequestTicket> {
  getList(
    request: ListDeviceRequestsRequestDto,
    isGetAll?: boolean,
  ): Promise<any>;
  createDocument(
    request: CreateDeviceRequestTicketRequestDto,
    code: string,
  ): Promise<DeviceRequestTicket>;
  getDetail(id: string): Promise<DeviceRequestTicket>;
  update(request: any, history: History): Promise<DeviceRequestTicket>;
  changeStatus(
    id: string,
    status: DeviceRequestTicketStatus,
    history: History,
  ): Promise<string>;
  delete(id: string): Promise<DeviceRequestTicket>;
  findOneById(id: string): Promise<DeviceRequestTicket>;
  getLatest(): Promise<DeviceRequestTicket>;
  findAllWithPopulate(
    condition: any,
    populate: any,
  ): Promise<DeviceRequestTicket[]>;
}

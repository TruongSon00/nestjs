import { ResponsePayload } from '@utils/response-payload';
import { PagingResponse } from '@utils/paging.response';
import { CreateDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/create-device-request-ticket.request.dto';
import { UpdateDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/update-device-request-ticket.request.dto';
import { ChangeStatusDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/change-status-device-request-ticket.request.dto';
import { CreateDeviceReturnTicketRequestDto } from '@components/device-request/dto/request/return-ticket/create-device-return-ticket.request.dto';
import { UpdateDeviceReturnTicketRequestDto } from '@components/device-request/dto/request/return-ticket/update-device-return-ticket.request.dto';
import { ChangeStatusDeviceReturnTicketRequestDto } from '@components/device-request/dto/request/return-ticket/change-status-device-return-ticket.request.dto';
import { ListDeviceRequestsRequestDto } from '@components/device-request/dto/request/list-device-requests.request.dto';
import { DeviceRequestTicketStatus } from '../../../models/device-request-ticket/device-request-ticket.schema';
import { DeviceRequestTicket } from '../../../models/device-request-ticket/device-request-ticket.model';

export interface DeviceRequestServiceInterface {
  getList(
    request: ListDeviceRequestsRequestDto,
  ): Promise<ResponsePayload<PagingResponse>>;
  createRequestTicket(
    request: CreateDeviceRequestTicketRequestDto,
  ): Promise<ResponsePayload<unknown>>;
  getDetailDeviceRequestTicket(id: string): Promise<ResponsePayload<unknown>>;
  updateDeviceRequestTicket(
    request: UpdateDeviceRequestTicketRequestDto,
  ): Promise<ResponsePayload<unknown>>;
  changeRequestTicketStatus(
    request: ChangeStatusDeviceRequestTicketRequestDto,
  ): Promise<ResponsePayload<unknown>>;
  deleteRequestTicket(id: string): Promise<ResponsePayload<unknown>>;
  createReturnTicket(
    request: CreateDeviceReturnTicketRequestDto,
  ): Promise<ResponsePayload<unknown>>;
  getDetailDeviceReturnTicket(id: string): Promise<ResponsePayload<unknown>>;
  updateDeviceReturnTicket(
    request: UpdateDeviceReturnTicketRequestDto,
  ): Promise<ResponsePayload<unknown>>;
  changeReturnTicketStatus(
    request: ChangeStatusDeviceReturnTicketRequestDto,
  ): Promise<ResponsePayload<unknown>>;
  deleteReturnTicket(id: string): Promise<ResponsePayload<unknown>>;
  getListRequestTicketsByStatus(
    status: DeviceRequestTicketStatus,
  ): Promise<ResponsePayload<PagingResponse>>;
  getListWorkCenter(): Promise<any>;
  generateTicketCode(): Promise<string>;
}

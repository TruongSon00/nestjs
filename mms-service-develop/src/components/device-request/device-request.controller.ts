import {
  Body,
  Controller,
  Inject,
  Injectable,
  Param,
  Query,
  Post,
  Put,
  Delete,
  Get,
  Patch,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { DeviceRequestServiceInterface } from '@components/device-request/interface/device-request.service.interface';
import { CreateDeviceRequestTicketBody } from '@components/device-request/dto/request/request-ticket/create-device-request-ticket.request.dto';
import { DetailDeviceRequestRequestDto } from '@components/device-request/dto/request/request-ticket/detail-device-request.request.dto';
import { UpdateDeviceRequestTicketBody } from '@components/device-request/dto/request/request-ticket/update-device-request-ticket.request.dto';
import { ChangeStatusDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/change-status-device-request-ticket.request.dto';
import { DeviceRequestTicketStatus } from '../../models/device-request-ticket/device-request-ticket.schema';
import { DeleteDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/delete-device-request-ticket.request.dto';
import { CreateDeviceReturnTicketRequestDto } from '@components/device-request/dto/request/return-ticket/create-device-return-ticket.request.dto';
import { DeleteDeviceReturnTicketRequestDto } from '@components/device-request/dto/request/return-ticket/delete-device-return-ticket.request.dto';
import { DetailDeviceReturnRequestDto } from '@components/device-request/dto/request/return-ticket/detail-device-return.request.dto';
import { UpdateDeviceReturnTicketRequestDto } from '@components/device-request/dto/request/return-ticket/update-device-return-ticket.request.dto';
import { ChangeStatusDeviceReturnTicketRequestDto } from '@components/device-request/dto/request/return-ticket/change-status-device-return-ticket.request.dto';
import { ListDeviceRequestsRequestDto } from '@components/device-request/dto/request/list-device-requests.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessResponse } from '@utils/success.response.dto';
import { DetailDeviceRequestTicketResponseDto } from './dto/response/detail-device-request-ticket.response.dto';
import { ListDeviceRequestsResponseDto } from './dto/response/list-device-requests.response.dto';
import { ListWorkCenterResponse } from './dto/response/list-work-center.response.dto';
import { CREATE_REQUEST_TICKET_PERMISSION, CREATE_RETURN_TICKET_PERMISSION, DELETE_REQUEST_TICKET_PERMISSION, DELETE_RETURN_TICKET_PERMISSION, DETAIL_REQUEST_TICKET_PERMISSION, DETAIL_RETURN_TICKET_PERMISSION, LIST_DEVICE_REQUEST_PERMISSION, UPDATE_REQUEST_TICKET_PERMISSION, UPDATE_RETURN_TICKET_PERMISSION } from '@utils/permissions/device-request';
import { PermissionCode } from '@core/decorator/get-code.decorator';
@Injectable()
@Controller()
export class DeviceRequestController {
  constructor(
    @Inject('DeviceRequestServiceInterface')
    private readonly deviceRequestService: DeviceRequestServiceInterface,
  ) {}

  //@MessagePattern('device_request_ticket_create')
  @PermissionCode(CREATE_REQUEST_TICKET_PERMISSION.code)
  @ApiOperation({
    tags: ['DeviceRequests_RequestTickets'],
    summary: 'Tạo yêu cầu cấp thiết bị',
    description: 'Tạo yêu cầu cấp thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: String,
  })
  @Post('/device-requests/request-tickets')
  async createRequestTicket(
    @Body() payload: CreateDeviceRequestTicketBody,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.userCreatorId = request.userId;

    return await this.deviceRequestService.createRequestTicket(request);
  }

  //@MessagePattern('device_request_ticket_delete')
  @PermissionCode(DELETE_REQUEST_TICKET_PERMISSION.code)
  @ApiOperation({
    tags: ['DeviceRequests_RequestTickets'],
    summary: 'Xóa yêu cầu cấp thiết bị',
    description: 'Xóa yêu cầu cấp thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  @Delete('/device-requests/request-tickets/:id')
  async deleteRequestTicket(
    @Param() payload: DeleteDeviceRequestTicketRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceRequestService.deleteRequestTicket(request);
  }

  //@MessagePattern('device_request_ticket_detail')
  @PermissionCode(DETAIL_REQUEST_TICKET_PERMISSION.code)
  @ApiOperation({
    tags: ['DeviceRequests_RequestTickets'],
    summary: 'Chi tiết yêu cầu cấp thiết bị',
    description: 'Chi tiết yêu cầu cấp thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DetailDeviceRequestTicketResponseDto,
  })
  @Get('/device-requests/request-tickets/:id')
  async getDetailRequestTicket(
    @Param() payload: DetailDeviceRequestRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceRequestService.getDetailDeviceRequestTicket(
      request,
    );
  }

  //@MessagePattern('device_request_ticket_update')
  @PermissionCode(UPDATE_REQUEST_TICKET_PERMISSION.code)
  @ApiOperation({
    tags: ['DeviceRequests_RequestTickets'],
    summary: 'Sửa yêu cầu cấp thiết bị',
    description: 'Sửa yêu cầu cấp thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: String,
  })
  @Put('/device-requests/request-tickets')
  async updateRequestTicket(
    @Body() payload: UpdateDeviceRequestTicketBody,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.userCreatorId = request.userId;
    return await this.deviceRequestService.updateDeviceRequestTicket(request);
  }

  //@MessagePattern('device_request_ticket_change_status')
  @ApiOperation({
    tags: ['DeviceRequests_RequestTickets'],
    summary: 'Đổi trạng thái yêu cầu cấp thiết bị',
    description: 'Đổi trạng thái yêu cầu cấp thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: String,
  })
  @Patch('/device-requests/request-tickets')
  async changeRequestTicketStatus(
    @Body() payload: ChangeStatusDeviceRequestTicketRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceRequestService.changeRequestTicketStatus(request);
  }

  //@MessagePattern('device_return_ticket_create')
  @PermissionCode(CREATE_RETURN_TICKET_PERMISSION.code)
  @ApiOperation({
    tags: ['DeviceRequests_ReturnTickets'],
    summary: 'Tạo yêu cầu trả thiết bị',
    description: 'Tạo yêu cầu trả thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: String,
  })
  @Post('/device-requests/return-tickets')
  async createReturnTicket(
    @Body() payload: CreateDeviceReturnTicketRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceRequestService.createReturnTicket(request);
  }

  //@MessagePattern('device_return_ticket_delete')
  @PermissionCode(DELETE_RETURN_TICKET_PERMISSION.code)
  @ApiOperation({
    tags: ['DeviceRequests_ReturnTickets'],
    summary: 'Xóa yêu cầu trả thiết bị',
    description: 'Xóa yêu cầu trả thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DetailDeviceRequestTicketResponseDto,
  })
  @Delete('/device-requests/return-tickets/:id')
  async deleteReturnTicket(
    @Param() payload: DeleteDeviceReturnTicketRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceRequestService.deleteReturnTicket(request);
  }

  //@MessagePattern('device_return_ticket_detail')
  @PermissionCode(DETAIL_RETURN_TICKET_PERMISSION.code)
  @ApiOperation({
    tags: ['DeviceReturns_ReturnTickets'],
    summary: 'Chi tiết yêu cầu trả thiết bị',
    description: 'Chi tiết yêu cầu trả thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    //type: DetailDeviceReturnTicketResponseDto,
  })
  @Get('/device-requests/return-tickets/:id')
  async getDetailReturnTicket(
    @Param() payload: DetailDeviceReturnRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceRequestService.getDetailDeviceReturnTicket(request);
  }

  //@MessagePattern('device_return_ticket_update')
  @PermissionCode(UPDATE_RETURN_TICKET_PERMISSION.code)
  @ApiOperation({
    tags: ['DeviceReturns_ReturnTickets'],
    summary: 'Sửa yêu cầu trả thiết bị',
    description: 'Sửa yêu cầu trả thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: String,
  })
  @Put('/device-requests/return-tickets')
  async updateReturnTicket(
    @Body() payload: UpdateDeviceReturnTicketRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceRequestService.updateDeviceReturnTicket(request);
  }

  //@MessagePattern('device_return_ticket_change_status')
  @ApiOperation({
    tags: ['DeviceReturns_ReturnTickets'],
    summary: 'Đổi trạng thái yêu cầu trả thiết bị',
    description: 'Đổi trạng thái yêu cầu trả thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: String,
  })
  @Patch('/device-requests/return-tickets')
  async changeStatusReturnTicket(
    @Body() payload: ChangeStatusDeviceReturnTicketRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceRequestService.changeReturnTicketStatus(request);
  }

  //@MessagePattern('device_requests_list')
  @PermissionCode(LIST_DEVICE_REQUEST_PERMISSION.code)
  @ApiOperation({
    tags: ['DeviceRequests'],
    summary: 'Danh sách yêu cầu thiết bị',
    description: 'Danh sách yêu cầu thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListDeviceRequestsResponseDto,
  })
  @Get('/device-requests')
  async getListDeviceRequests(
    @Query() query: ListDeviceRequestsRequestDto,
  ): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceRequestService.getList(request);
  }

  //@MessagePattern('device_requests_awaiting_assignment_list')

  @ApiOperation({
    tags: ['DeviceRequests_RequestTickets'],
    summary: 'Danh sách yêu cầu cấp thiết bị chờ phân công',
    description: 'Danh sách yêu cầu cấp thiết bị chờ phân công',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @Get('/device-requests/awaiting-assignment-request-tickets')
  async getListRequestTicketsAwaitingAssignment(
    @Body() payload: any,
  ): Promise<any> {
    const { responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceRequestService.getListRequestTicketsByStatus(
      DeviceRequestTicketStatus.AwaitingAssignment,
    );
  }

  //@MessagePattern('get_work_center_list')
  @ApiOperation({
    tags: ['DeviceRequests'],
    summary: 'Danh sách xưởng',
    description: 'Danh sách xưởng',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListWorkCenterResponse,
  })
  @Get('/device-requests/work-centers')
  async getWorkCenterList(@Query() payload: any): Promise<any> {
    const { responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceRequestService.getListWorkCenter();
  }
}

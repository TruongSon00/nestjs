import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { HistoryServiceInterface } from '@components/history/interface/history.service.interface';
import { DeviceRequestTicketRepositoryInterface } from '@components/device-request/interface/device-request-ticket.repository.interface';
import { DeviceReturnTicketRepositoryInterface } from '@components/device-request/interface/device-return-ticket.repository.interface';
import { DeviceRequestServiceInterface } from '@components/device-request/interface/device-request.service.interface';
import { ResponsePayload } from '@utils/response-payload';
import { PagingResponse } from '@utils/paging.response';
import { CreateDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/create-device-request-ticket.request.dto';
import { HistoryActionEnum } from '@components/history/history.constant';
import { DetailDeviceRequestTicketResponseDto } from '@components/device-request/dto/response/detail-device-request-ticket.response.dto';
import { ProduceServiceInterface } from '@components/produce/interface/produce.service.interface';
import { UpdateDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/update-device-request-ticket.request.dto';
import { DeviceRequestTicketStatus } from '../../models/device-request-ticket/device-request-ticket.schema';
import { ChangeStatusDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/change-status-device-request-ticket.request.dto';
import { History } from '../../models/history/history.model';
import { ChangeStatusDeviceReturnTicketRequestDto } from '@components/device-request/dto/request/return-ticket/change-status-device-return-ticket.request.dto';
import { DeviceReturnTicketStatus } from '../../models/device-return-ticket/device-return-ticket.schema';
import { CreateDeviceReturnTicketRequestDto } from '@components/device-request/dto/request/return-ticket/create-device-return-ticket.request.dto';
import { UpdateDeviceReturnTicketRequestDto } from '@components/device-request/dto/request/return-ticket/update-device-return-ticket.request.dto';
import {
  DetailDeviceReturnTicketResponseDto,
  DeviceAssignmentDto,
} from '@components/device-request/dto/response/detail-device-return-ticket.response.dto';
import { flatMap, isEmpty, keyBy } from 'lodash';
import { ListDeviceRequestsRequestDto } from '@components/device-request/dto/request/list-device-requests.request.dto';
import {
  DeviceDto,
  ListDeviceRequestsResponseDto,
  UserDto,
} from '@components/device-request/dto/response/list-device-requests.response.dto';
import {
  DEVICE_REQUEST_CONST,
  DeviceRequestType,
  ListDeviceRequestStatus,
} from '@components/device-request/device-request.constant';
import { DeviceServiceInterface } from '@components/device/interface/device.service.interface';
import { isSqlId } from '../../validator/is-sql-id.validator';
import { DeviceReturnTicket } from '../../models/device-return-ticket/device-return-ticket.model';
import { DeviceAssignmentServiceInterface } from '@components/device-assignment/interface/device-assignment.service.interface';
import { DEVICE_ASIGNMENTS_STATUS_ENUM } from '@components/device-assignment/device-assignment.constant';
import { DeviceRequestTicket } from '../../models/device-request-ticket/device-request-ticket.model';
import { Connection, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { generateCodeByPreviousCode } from '../../helper/code.helper';
import { SEPARATOR } from '@constant/common';
import { joinToCompare } from '../../helper/string.helper';
import { ApiError } from '@utils/api.error';
import { plainToInstance } from 'class-transformer';
import { minus, paginate } from '@utils/common';
import { compareFn } from '@utils/helper';
import { ItemService } from '@components/item/item.service';
import { SaleService } from '@components/sale/sale.service';
import { DeviceRepositoryInterface } from '@components/device/interface/device.repository.interface';
import * as moment from 'moment';
import { PREFIX_PO_CODE } from '@components/sale/sale.constant';
import { DeviceAssignmentRepositoryInterface } from '@components/device-assignment/interface/device-assignment.repository.interface';
import { ListWorkCenterResponse } from './dto/response/list-work-center.response.dto';
import {
  CreatePurchasedOrderDto,
  ItemPORequest,
} from '@components/sale/dto/create-purchase-order.request';
import { DeviceType } from '@components/device/device.constant';

@Injectable()
export class DeviceRequestService implements DeviceRequestServiceInterface {
  constructor(
    @Inject('DeviceRequestTicketRepositoryInterface')
    private readonly deviceRequestTicketRepository: DeviceRequestTicketRepositoryInterface,

    @Inject('DeviceReturnTicketRepositoryInterface')
    private readonly deviceReturnTicketRepository: DeviceReturnTicketRepositoryInterface,

    @Inject('DeviceRepositoryInterface')
    private readonly deviceRepository: DeviceRepositoryInterface,

    @Inject('HistoryServiceInterface')
    private readonly historyService: HistoryServiceInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceServiceInterface,

    @Inject('DeviceServiceInterface')
    private readonly deviceService: DeviceServiceInterface,

    @Inject('DeviceAssignmentServiceInterface')
    private readonly deviceAssignmentService: DeviceAssignmentServiceInterface,

    @Inject('DeviceAssignmentRepositoryInterface')
    private readonly deviceAssignmentRepository: DeviceAssignmentRepositoryInterface,

    @Inject('ItemServiceInterface')
    private readonly itemService: ItemService,

    @Inject('SaleServiceInterface')
    private readonly saleService: SaleService,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async changeRequestTicketStatus(
    request: ChangeStatusDeviceRequestTicketRequestDto,
  ): Promise<ResponsePayload<unknown>> {
    const { id, status, userId, user } = request;
    const deviceRequest = await this.deviceRequestTicketRepository.findOneById(
      id,
    );
    if (!deviceRequest) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    if (
      status === DeviceRequestTicketStatus.WaitingExport &&
      deviceRequest.workCenterId
    ) {
      const deviceRequestByWorkCenter =
        await this.deviceRequestTicketRepository.findOneByCondition({
          workCenterId: deviceRequest.workCenterId,
          status: {
            $in: [
              DeviceRequestTicketStatus.WaitingExport,
              DeviceRequestTicketStatus.AwaitingAssignment,
            ],
          },
        });
      const deviceAssignByWorkCenter =
        await this.deviceAssignmentRepository.findOneByCondition({
          workCenterId: deviceRequest.workCenterId,
        });

      if (deviceRequestByWorkCenter || deviceAssignByWorkCenter) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate(
              'error.WORK_CENTER_HAS_BEEN_DEVICE_ASSIGN',
            ),
          )
          .build();
      }
    }
    const history: History = {
      userId: userId,
      action: null,
      createdAt: new Date(),
    };

    const device = await this.deviceRepository.findOneById(
      deviceRequest.device.toString(),
    );
    if (!device) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.DEVICE_NOT_FOUND'))
        .build();
    }

    let previousStatus = DeviceRequestTicketStatus.AwaitingConfirmation;

    switch (status) {
      case DeviceRequestTicketStatus.AwaitingITConfirmation:
        history.action = HistoryActionEnum.CONFIRM;
        break;
      case DeviceRequestTicketStatus.WaitingExport:
        previousStatus = DeviceRequestTicketStatus.AwaitingITConfirmation;
        history.action = HistoryActionEnum.CONFIRM;
        break;
      case DeviceRequestTicketStatus.AwaitingAssignment:
        previousStatus = DeviceRequestTicketStatus.WaitingExport;
        history.action = HistoryActionEnum.CONFIRM;
        break;
      case DeviceRequestTicketStatus.Confirmed:
        previousStatus = DeviceRequestTicketStatus.Installed;
        history.action = HistoryActionEnum.CONFIRM;
        break;
      case DeviceRequestTicketStatus.Rejected:
        history.action = HistoryActionEnum.REJECT;
        break;
      default:
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.DEVICE_REQUEST_INVALID_STATUS'),
          )
          .build();
    }

    const [checkUnconfirmedRequestTicket, requestTicket] =
      await this.checkUnconfirmedRequestTicket(id, previousStatus);

    if (checkUnconfirmedRequestTicket) return checkUnconfirmedRequestTicket;

    const session = await this.connection.startSession();

    try {
      await session.startTransaction();

      if (status == DeviceRequestTicketStatus.Confirmed) {
        const deviceAssignmentResponse =
          await this.deviceAssignmentService.getByDeviceRequestTicketId(
            requestTicket._id,
          );

        if (deviceAssignmentResponse.statusCode != ResponseCodeEnum.SUCCESS) {
          await session.abortTransaction();

          return deviceAssignmentResponse;
        }

        const updateDeviceAssignmentsResult =
          await this.deviceAssignmentService.updateStatusByIds(
            deviceAssignmentResponse.data.map((assignment) => assignment._id),
            DEVICE_ASIGNMENTS_STATUS_ENUM.IN_USE,
          );

        if (
          updateDeviceAssignmentsResult.statusCode != ResponseCodeEnum.SUCCESS
        ) {
          await session.abortTransaction();

          return updateDeviceAssignmentsResult;
        }
      }

      if (status === DeviceRequestTicketStatus.WaitingExport) {
        const itemPO: ItemPORequest[] = [];
        const itemStock = await this.itemService.getItemQuantityInWarehouses(
          device.code,
        );
        const itemDetail = await this.itemService.detailItem(device.code);

        if (
          (isEmpty(itemStock) ||
            (!isEmpty(itemStock) &&
              itemStock.quantity < requestTicket.quantity)) &&
          itemDetail.code === device.code
        )
          itemPO.push({
            quantity: minus(requestTicket.quantity, itemStock?.quantity || 0),
            id: itemDetail.id,
          });
        if (!isEmpty(itemPO)) {
          const purchaseOrder = new CreatePurchasedOrderDto();
          const purchaseCode = `${PREFIX_PO_CODE}${request.id.slice(
            request.id.length - 5,
            request.id.length,
          )}`;
          purchaseOrder.createdByUserId = request.userId;
          purchaseOrder.userId = request.userId;
          purchaseOrder.items = itemPO;
          purchaseOrder.type = 0;
          purchaseOrder.deadline = moment(requestTicket.createdAt)
            .add(1, 'day')
            .toDate();
          purchaseOrder.purchasedAt = new Date();
          purchaseOrder.code = purchaseCode;
          purchaseOrder.companyId = user?.companyId ?? null;
          purchaseOrder.vendorId = device?.information?.vendor ?? null;
          purchaseOrder.name = (
            await this.i18n.translate('text.deviceRequestName')
          ).replace('{POCode}', purchaseCode);
          const purchaseResponse = await this.saleService.createPO(
            purchaseOrder,
          );

          if (purchaseResponse.statusCode !== ResponseCodeEnum.SUCCESS) {
            return new ApiError(
              purchaseResponse.statusCode,
              purchaseResponse.message,
            ).toResponse();
          }
        }
      }

      await this.deviceRequestTicketRepository.changeStatus(
        id,
        status,
        history,
      );

      await session.commitTransaction();

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      await session.abortTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_UPDATE'))
        .build();
    } finally {
      if (session) await session.endSession();
    }
  }

  async createRequestTicket(
    request: CreateDeviceRequestTicketRequestDto,
  ): Promise<ResponsePayload<unknown>> {
    try {

      const { userCreatorId, workCenterId, deviceId, userId } = request;

      const deviceResponse = await this.deviceService.findOneById(deviceId);

      const device = deviceResponse.data;

      if (!device) return deviceResponse;

      const deviceType = device.type;

      if (deviceType == DeviceType.Normal && workCenterId) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate(
              'error.DEVICE_REQUEST_TICKET_CANNOT_HAVE_WORK_CENTER',
            ),
          )
          .build();
      }

      if (
        deviceType == DeviceType.ForManufacture &&
        (!workCenterId || !isSqlId(workCenterId))
      ) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.WORK_CENTER_INVALID'))
          .build();
      }

      const code = await this.generateTicketCode();

      const deviceRequestTicketDocument =
        await this.deviceRequestTicketRepository.createDocument(request, code);

      // create a deviceRequestTicket and assign to history
      const deviceRequestTicket =
        await this.deviceRequestTicketRepository.create(
          deviceRequestTicketDocument,
        );

      deviceRequestTicket.histories.push({
        userId: userCreatorId,
        action: HistoryActionEnum.CREATE,
        createdAt: new Date(),
      });

      await deviceRequestTicket.save();

      return new ResponseBuilder(deviceRequestTicket.id)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_CREATE'))
        .build();
    }
  }

  async deleteRequestTicket(id: string): Promise<ResponsePayload<unknown>> {
    const [checkUnconfirmedRequestTicket] =
      await this.checkUnconfirmedRequestTicket(id);

    if (checkUnconfirmedRequestTicket) return checkUnconfirmedRequestTicket;

    try {
      await this.deviceRequestTicketRepository.softDelete(id);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.CAN_NOT_DELETE'))
        .build();
    }
  }

  async getDetailDeviceRequestTicket(
    id: string,
  ): Promise<ResponsePayload<unknown>> {
    const deviceRequestTicket =
      await this.deviceRequestTicketRepository.getDetail(id);

    if (!deviceRequestTicket) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.DEVICE_REQUEST_TICKET_NOT_FOUND'),
        )
        .build();
    }

    await this.historyService.mapUserHistory(deviceRequestTicket.histories);

    const result: DetailDeviceRequestTicketResponseDto = {
      id: deviceRequestTicket.id,
      code: deviceRequestTicket.code,
      name: deviceRequestTicket.name,
      description: deviceRequestTicket.description,
      quantity: deviceRequestTicket.quantity,
      status: deviceRequestTicket.status,
      device: deviceRequestTicket.device,
      histories: deviceRequestTicket.histories,
      user: null,
      workCenter: null,
    };

    const getUserTask = this.userService.getUserById(
      deviceRequestTicket.userId,
    );
    const getWorkCenterTask = this.produceService.getDetailWorkCenter(
      deviceRequestTicket.workCenterId,
    );

    const [user, workCenter] = await Promise.all([
      getUserTask,
      getWorkCenterTask,
    ]);

    if (user)
      result.user = {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
      };

    if (workCenter)
      result.workCenter = {
        id: workCenter.id,
        name: workCenter.name,
      };

    return new ResponseBuilder(result).build();
  }

  private async mapUserInfo(users: any[], id: number): Promise<UserDto> {
    const user = users.find((user) => user.id === id);

    if (!isEmpty(user))
      return plainToInstance(UserDto, user, { excludeExtraneousValues: true });

    return null;
  }

  private async mapTicketStatus(
    ticket: any,
    type: DeviceRequestType,
  ): Promise<ListDeviceRequestStatus> {
    const mapRequestTicketStatus = ({ status }: any) => {
      switch (status) {
        case DeviceRequestTicketStatus.AwaitingAssignment:
          return ListDeviceRequestStatus.AwaitingAssignment;
        case DeviceRequestTicketStatus.Assigned:
          return ListDeviceRequestStatus.Assigned;
        case DeviceRequestTicketStatus.Confirmed:
          return ListDeviceRequestStatus.Confirmed;
        case DeviceRequestTicketStatus.Rejected:
          return ListDeviceRequestStatus.Rejected;
        case DeviceRequestTicketStatus.WaitingExport:
          return ListDeviceRequestStatus.WaitingExport;
        case DeviceRequestTicketStatus.Installed:
          return ListDeviceRequestStatus.Installed;
        default:
          break;
      }
    };

    const mapReturnTicketStatus = ({ status }: any) => {
      switch (status) {
        case DeviceReturnTicketStatus.AwaitingReturn:
          return ListDeviceRequestStatus.AwaitingReturn;
        case DeviceReturnTicketStatus.Returned:
          return ListDeviceRequestStatus.Returned;
        case DeviceReturnTicketStatus.Rejected:
          return ListDeviceRequestStatus.Rejected;
        default:
          return status;
      }
    };

    const { status } = ticket;

    if (
      status == ListDeviceRequestStatus.AwaitingConfirmation ||
      status == ListDeviceRequestStatus.AwaitingITConfirmation
    )
      return status;

    switch (type) {
      case DeviceRequestType.Request:
        return mapRequestTicketStatus(ticket);
      case DeviceRequestType.Return:
        return mapReturnTicketStatus(ticket);
      default:
        throw new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.DEVICE_REQUEST_INVALID_STATUS'),
        );
    }
  }

  async getList(
    request: ListDeviceRequestsRequestDto,
  ): Promise<ResponsePayload<PagingResponse>> {
    const { filter, sort, page, take } = request;

    const quantityColumn = DEVICE_REQUEST_CONST.QUANTITY.COLUMN;
    const typeColumn = DEVICE_REQUEST_CONST.TYPE.COLUMN;
    const statusColumn = DEVICE_REQUEST_CONST.STATUS.COLUMN;

    const deviceConst = DEVICE_REQUEST_CONST.DEVICE;
    const deviceUserColumn = deviceConst.USER.COLUMN;

    const checkGetAll = (column) => {
      switch (column) {
        case quantityColumn:
        case typeColumn:
        case statusColumn:
        case deviceUserColumn:
          return true;
        default:
          return false;
      }
    };

    let isGetAll = false;
    let isNotSortOnDb = false;
    let isNotFilterOnDb = false;

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        isNotFilterOnDb = checkGetAll(item.column);

        isGetAll = isNotFilterOnDb;

        if (isNotFilterOnDb) return;
      });
    }

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        isNotSortOnDb = checkGetAll(item.column);

        isGetAll = isNotSortOnDb;

        if (isNotSortOnDb) return;
      });
    }

    const { tickets, count } = await this.deviceRequestTicketRepository.getList(
      request,
      isGetAll,
    );

    const workCenterIds = flatMap(tickets, 'workCenterId');
    let workCenters;
    if (!isEmpty(workCenterIds)) {
      const workCenterListAll = await this.produceService.getWorkCenters({
        isGetAll: '1',
      });
      workCenters = keyBy(workCenterListAll?.items, 'id');
    }
    let finalCount = count;

    const userIds = new Set<number>();

    tickets.map((ticket) => {
      const ticketUserId = Number.parseInt(ticket.userId);

      if (!isNaN(ticketUserId)) userIds.add(ticketUserId);
      else
        ticket.devices.forEach((device) => {
          const deviceUserId = Number.parseInt(device.userId);

          if (!isNaN(deviceUserId)) userIds.add(deviceUserId);
        });
    });

    const users = await this.userService.getListByIDs(Array.from(userIds));

    let result = await Promise.all(
      tickets.map(async (plainTicket) => {
        const type: DeviceRequestType = plainTicket.quantity
          ? DeviceRequestType.Request
          : DeviceRequestType.Return;
        plainTicket.workCenter = plainTicket?.workCenterId
          ? workCenters[plainTicket.workCenterId]
          : null;
        const resultTicket = plainToInstance(
          ListDeviceRequestsResponseDto,
          plainTicket,
          {
            excludeExtraneousValues: true,
          },
        );

        resultTicket.id = plainTicket.id;

        const mapStatusTask = this.mapTicketStatus(plainTicket, type);

        const mapDevicesTask = plainTicket.devices.map(async (plainDevice) => {
          const userId = plainTicket.userId ?? plainDevice.userId;

          const deviceDto = plainToInstance(DeviceDto, plainDevice, {
            excludeExtraneousValues: true,
          });

          deviceDto.id = plainDevice._id;
          deviceDto.user = await this.mapUserInfo(users, userId);

          return deviceDto;
        });

        const [mappedStatus, mappedDevices] = await Promise.all([
          mapStatusTask,
          await Promise.all(mapDevicesTask),
        ]);

        resultTicket.type = type;
        resultTicket.status = mappedStatus;
        resultTicket.devices = mappedDevices;

        if (type == DeviceRequestType.Return)
          resultTicket.quantity = resultTicket.devices.length;

        return resultTicket;
      }),
    );

    if (isNotFilterOnDb) {
      filter.forEach((item) => {
        const text = item.text;

        switch (item.column) {
          case quantityColumn:
            result = result.filter(
              (ticket) => ticket.quantity == Number.parseInt(text),
            );
            break;
          case typeColumn:
            result = result.filter(
              (ticket) => ticket.type == Number.parseInt(text),
            );
            break;
          case statusColumn:
            result = result.filter(
              (ticket) => ticket.status == Number.parseInt(text),
            );
            break;
          case deviceUserColumn:
            result = result.filter((ticket) => {
              const ticketDeviceUsers = joinToCompare(
                (device) => device.user.username,
                ticket.devices,
                SEPARATOR,
              );

              return ticketDeviceUsers.isMatchKeyword(text);
            });
            break;
          default:
            break;
        }
      });
    }

    if (isNotSortOnDb) {
      for (const item of sort) {
        const order = item.order?.toSortOrder();

        switch (item.column) {
          case statusColumn:
            const statusArr = await Promise.all(
              Object.keys(ListDeviceRequestStatus)
                .filter((status) => !isNaN(Number(status)))
                .map((status) =>
                  this.i18n.translate(`text.DEVICE_REQUEST_STATUS.${status}`),
                ),
            );

            result = result.sort((ticket1, ticket2) => {
              const status1 = statusArr[ticket1.status].removeVietnameseSign();
              const status2 = statusArr[ticket2.status].removeVietnameseSign();

              return compareFn(order, status1, status2);
            });
            break;
          case deviceUserColumn:
            result = result.sort((ticket1, ticket2) => {
              const ticket1DeviceUsers = joinToCompare(
                (device) => device.user.username,
                ticket1.devices,
                SEPARATOR,
              );
              const ticket2DeviceUsers = joinToCompare(
                (device) => device.user.username,
                ticket2.devices,
                SEPARATOR,
              );

              return compareFn(order, ticket1DeviceUsers, ticket2DeviceUsers);
            });
            break;
          case typeColumn:
            result = result.sort((ticket1, ticket2) =>
              compareFn(order, ticket1.type, ticket2.type),
            );
            break;
          case quantityColumn:
            result = result.sort((ticket1, ticket2) =>
              compareFn(order, ticket1.quantity, ticket2.quantity),
            );
            break;
          default:
            break;
        }
      }
    }

    if (isNotFilterOnDb || isNotSortOnDb) {
      finalCount = result.length;
      result = paginate(result, take, page);
    }

    return new ResponseBuilder<PagingResponse>({
      items: result,
      meta: { total: finalCount, page: page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async updateDeviceRequestTicket(
    request: UpdateDeviceRequestTicketRequestDto,
  ): Promise<ResponsePayload<unknown>> {
    const { id, userCreatorId, userId } = request;
    const [checkUnconfirmedRequestTicket] =
      await this.checkUnconfirmedRequestTicket(id);

    if (checkUnconfirmedRequestTicket) return checkUnconfirmedRequestTicket;

    const deviceRequestByWorkCenter =
      await this.deviceRequestTicketRepository.findOneByCondition({
        id: {
          $ne: new Types.ObjectId(id),
        },
        workCenterId: request.workCenterId,
        status: DeviceRequestTicketStatus.Confirmed,
      });
    if (deviceRequestByWorkCenter) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.WORK_CENTER_HAS_BEEN_DEVICE_ASSIGN'),
      ).toResponse();
    }

    try {
      await this.deviceRequestTicketRepository.update(request, {
        userId: userCreatorId,
        action: HistoryActionEnum.UPDATE,
        createdAt: new Date(),
      });

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_UPDATE'))
        .build();
    }
  }

  private async checkUnconfirmedRequestTicket(
    id: string,
    conditionalStatus?: DeviceRequestTicketStatus,
  ): Promise<[ResponsePayload<unknown>, DeviceRequestTicket]> {
    const requestTicket =
      await this.deviceRequestTicketRepository.findOneByCondition({
        _id: new Types.ObjectId(id),
        deletedAt: null,
      });

    if (!requestTicket)
      return [
        new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.DEVICE_REQUEST_TICKET_NOT_FOUND'),
          )
          .build(),
        null,
      ];

    const status = requestTicket.status;

    if (conditionalStatus && status != conditionalStatus)
      return [
        new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.DEVICE_TICKET_INVALID_STATUS'),
          )
          .build(),
        null,
      ];

    if (
      status != DeviceRequestTicketStatus.AwaitingConfirmation &&
      status == DeviceRequestTicketStatus.Rejected
    )
      return [
        new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.DEVICE_REQUEST_TICKET_USED'),
          )
          .build(),
        null,
      ];

    return [null, requestTicket];
  }

  async changeReturnTicketStatus(
    request: ChangeStatusDeviceReturnTicketRequestDto,
  ): Promise<ResponsePayload<unknown>> {
    const { id, status, userId } = request;

    let previousStatus = DeviceReturnTicketStatus.AwaitingConfirmation;

    const history: History = {
      userId: userId,
      action: null,
      createdAt: new Date(),
    };

    switch (status) {
      case DeviceReturnTicketStatus.AwaitingITConfirmation:
        history.action = HistoryActionEnum.CONFIRM;
        break;
      case DeviceReturnTicketStatus.AwaitingReturn:
        previousStatus = DeviceReturnTicketStatus.AwaitingITConfirmation;
        history.action = HistoryActionEnum.CONFIRM;
        break;
      case DeviceReturnTicketStatus.Returned:
        previousStatus = DeviceReturnTicketStatus.AwaitingReturn;
        history.action = HistoryActionEnum.CONFIRM;
        break;
      case DeviceReturnTicketStatus.Rejected:
        history.action = HistoryActionEnum.REJECT;
        break;
      default:
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.DEVICE_REQUEST_INVALID_STATUS'),
          )
          .build();
    }

    const [checkUnconfirmedReturnTicket, returnTicket] =
      await this.checkUnconfirmedReturnTicket(id, previousStatus);

    if (checkUnconfirmedReturnTicket) return checkUnconfirmedReturnTicket;

    // TODO: using session + transaction
    const session = await this.connection.startSession();

    try {
      await session.startTransaction();

      if (status == DeviceReturnTicketStatus.Returned) {
        const updateDeviceAssignmentsResult =
          await this.deviceAssignmentService.updateStatusByIds(
            returnTicket.deviceAssignments,
            DEVICE_ASIGNMENTS_STATUS_ENUM.RETURNED,
          );

        if (
          updateDeviceAssignmentsResult.statusCode != ResponseCodeEnum.SUCCESS
        ) {
          // await session.abortTransaction();

          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
            .withMessage(await this.i18n.translate('error.CAN_NOT_UPDATE'))
            .build();
        }
      }

      await this.deviceReturnTicketRepository.changeStatus(id, status, history);

      // await session.commitTransaction();

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      // await session.abortTransaction();

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.CAN_NOT_UPDATE'))
        .build();
    }
    // } finally {
    //   if (session) await session.endSession();
    // }
  }

  async createReturnTicket(
    request: CreateDeviceReturnTicketRequestDto,
  ): Promise<ResponsePayload<unknown>> {
    try {
      const { userId } = request;

      const code = await this.generateTicketCode();

      const deviceRequestTicketDocument =
        await this.deviceReturnTicketRepository.createDocument(request, code);

      // create a deviceReturnTicket and assign to history
      const deviceReturnTicket = await this.deviceReturnTicketRepository.create(
        deviceRequestTicketDocument,
      );

      deviceReturnTicket.histories.push({
        userId: userId,
        action: HistoryActionEnum.CREATE,
        createdAt: new Date(),
      });

      await deviceReturnTicket.save();

      return new ResponseBuilder(deviceReturnTicket.id)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_CREATE'))
        .build();
    }
  }

  async deleteReturnTicket(id: string): Promise<ResponsePayload<unknown>> {
    const [checkUnconfirmedReturnTicket] =
      await this.checkUnconfirmedReturnTicket(id);

    if (checkUnconfirmedReturnTicket) return checkUnconfirmedReturnTicket;

    try {
      await this.deviceReturnTicketRepository.softDelete(id);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.CAN_NOT_DELETE'))
        .build();
    }
  }

  async getDetailDeviceReturnTicket(
    id: string,
  ): Promise<ResponsePayload<unknown>> {
    const deviceReturnTicket =
      await this.deviceReturnTicketRepository.getDetail(id);

    if (!deviceReturnTicket) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.DEVICE_RETURN_TICKET_NOT_FOUND'),
        )
        .build();
    }

    await this.historyService.mapUserHistory(deviceReturnTicket.histories);

    const deviceAssignments = deviceReturnTicket.deviceAssignments.map(
      async (plainAssignment) => {
        const assignment = plainAssignment as any;

        const device = assignment.deviceRequestTicket.device;

        const result: DeviceAssignmentDto = {
          id: assignment._id,
          serial: assignment.serial,
          user: null,
          device: {
            id: device._id,
            code: device.code,
            name: device.name,
          },
        };

        const user = await this.userService.getUserById(assignment.userId);

        if (!isEmpty(user))
          result.user = {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
          };

        return result;
      },
    );

    const result: DetailDeviceReturnTicketResponseDto = {
      id: deviceReturnTicket._id,
      code: deviceReturnTicket.code,
      name: deviceReturnTicket.name,
      description: deviceReturnTicket.description,
      status: deviceReturnTicket.status,
      histories: deviceReturnTicket.histories,
      deviceAssignments: await Promise.all(deviceAssignments),
    };

    return new ResponseBuilder(result).build();
  }

  async updateDeviceReturnTicket(
    request: UpdateDeviceReturnTicketRequestDto,
  ): Promise<ResponsePayload<unknown>> {
    const { id, userId } = request;

    const [checkUnconfirmedReturnTicket] =
      await this.checkUnconfirmedReturnTicket(id);

    if (checkUnconfirmedReturnTicket) return checkUnconfirmedReturnTicket;

    try {
      await this.deviceReturnTicketRepository.update(request, {
        userId: userId,
        action: HistoryActionEnum.UPDATE,
        createdAt: new Date(),
      });

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_UPDATE'))
        .build();
    }
  }

  private async checkUnconfirmedReturnTicket(
    id: string,
    conditionalStatus?: DeviceReturnTicketStatus,
  ): Promise<[ResponsePayload<unknown>, DeviceReturnTicket]> {
    const returnTicket =
      await this.deviceReturnTicketRepository.findOneByCondition({
        _id: new Types.ObjectId(id),
        deletedAt: null,
      });

    if (!returnTicket)
      return [
        new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.DEVICE_RETURN_TICKET_NOT_FOUND'),
          )
          .build(),
        null,
      ];

    const status = returnTicket.status;

    if (conditionalStatus && status != conditionalStatus)
      return [
        new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.DEVICE_REQUEST_INVALID_STATUS'),
          )
          .build(),
        null,
      ];

    if (
      status != DeviceReturnTicketStatus.AwaitingConfirmation &&
      status == DeviceReturnTicketStatus.Rejected
    )
      return [
        new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.DEVICE_RETURN_TICKET_USED'),
          )
          .build(),
        null,
      ];

    return [null, returnTicket];
  }

  public async generateTicketCode(): Promise<string> {
    const [requestTicket, returnTicket] = await Promise.all([
      this.deviceRequestTicketRepository.getLatest(),
      this.deviceReturnTicketRepository.getLatest(),
    ]);

    const requestTicketCode = Number.parseInt(requestTicket?.code);

    const returnTicketCode = Number.parseInt(returnTicket?.code);

    const deviceRequestConst = DEVICE_REQUEST_CONST.CODE;

    const generateNewRequestCode = (currentCode: number) =>
      generateCodeByPreviousCode(
        currentCode,
        deviceRequestConst.MAX_LENGTH,
        deviceRequestConst.GAP,
        deviceRequestConst.PAD_CHAR,
      );

    const isNaNRequestTicketCode = isNaN(requestTicketCode);
    const isNaNReturnTicketCode = isNaN(returnTicketCode);

    if (isNaNRequestTicketCode && isNaNReturnTicketCode)
      return generateNewRequestCode(deviceRequestConst.DEFAULT_CODE);
    else
      return generateNewRequestCode(
        Math.max(requestTicketCode || 0, returnTicketCode || 0),
      );
  }

  async getListRequestTicketsByStatus(
    status: DeviceRequestTicketStatus,
  ): Promise<ResponsePayload<PagingResponse>> {
    const tickets = await this.deviceRequestTicketRepository.findAllByCondition(
      { status: status },
    );

    return new ResponseBuilder<PagingResponse>({
      items: plainToInstance(ListDeviceRequestsResponseDto, tickets, {
        excludeExtraneousValues: true,
      }),
      meta: { total: tickets.length },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async getListWorkCenter() {
    let workCenters = await this.produceService.getWorkCenters({
      isGetAll: '1',
      filter: [{ column: 'status', text: '2' }],
    });
    const deviceAssignment =
      await this.deviceAssignmentRepository.findAllByCondition({
        workCenterId: { $ne: null },
      });
    const deviceAssignmentWorkCenters = flatMap(
      deviceAssignment,
      'workCenterId',
    );
    workCenters = workCenters?.items.filter(
      (workCenter) => !deviceAssignmentWorkCenters.includes(workCenter.id),
    );
    const leaderIds = flatMap(workCenters, 'leaderId');
    const leaders = await this.userService.getListByIDs(leaderIds);
    const listLeader = keyBy(leaders, 'id');
    const data = workCenters.map((workCenter) => ({
      ...workCenter,
      leader: {
        id: listLeader[workCenter?.leaderId]?.id,
        username: listLeader[workCenter?.leaderId]?.username,
        fullName: listLeader[workCenter?.leaderId]?.fullName,
      },
    }));
    const res = plainToInstance(ListWorkCenterResponse, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(res)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }
}

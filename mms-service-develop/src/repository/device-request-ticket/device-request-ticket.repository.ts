import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { History } from '../../models/history/history.model';
import { DeviceRequestTicketRepositoryInterface } from '@components/device-request/interface/device-request-ticket.repository.interface';
import { DeviceRequestTicket } from '../../models/device-request-ticket/device-request-ticket.model';
import {
  DEVICE_REQUEST_CONST,
  DeviceRequestType,
} from '@components/device-request/device-request.constant';
import { CreateDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/create-device-request-ticket.request.dto';
import { DeviceRequestTicketStatus } from '../../models/device-request-ticket/device-request-ticket.schema';
import { ListDeviceRequestsRequestDto } from '@components/device-request/dto/request/list-device-requests.request.dto';
import { isEmpty } from 'lodash';
import {
  BASE_ENTITY_CONST,
  DOCUMENT_CONST,
  FieldVisibility,
  SortOrder,
} from '@constant/database.constant';
import { DeviceReturnTicket } from '../../models/device-return-ticket/device-return-ticket.model';
import { findByIdAndPopulateHistory } from '@utils/extensions/mongoose.extension';
import { DEVICE_ASIGNMENTS_STATUS_ENUM } from '@components/device-assignment/device-assignment.constant';
import * as moment from 'moment';

@Injectable()
export class DeviceRequestTicketRepository
  extends BaseAbstractRepository<DeviceRequestTicket>
  implements DeviceRequestTicketRepositoryInterface
{
  constructor(
    @InjectModel('DeviceRequestTicket')
    private readonly deviceRequestTicketModel: Model<DeviceRequestTicket>,

    @InjectModel('DeviceReturnTicket')
    private readonly deviceReturnTicketModel: Model<DeviceReturnTicket>,
  ) {
    super(deviceRequestTicketModel);
  }

  async getLatest(): Promise<DeviceRequestTicket> {
    return await this.deviceRequestTicketModel
      .findOne(null, 'code', {
        sort: {
          _id: SortOrder.Descending,
        },
      })
      .exec();
  }

  async createDocument(
    request: CreateDeviceRequestTicketRequestDto,
    code: string,
  ): Promise<DeviceRequestTicket> {
    const ticket = new this.deviceRequestTicketModel();

    ticket.code = code;

    return this.updateDocument(ticket, request);
  }

  updateDocument(
    deviceRequestTicket: DeviceRequestTicket & { _id: any },
    request: CreateDeviceRequestTicketRequestDto,
  ): DeviceRequestTicket & { _id: any } {
    const { deviceId, name, uId, quantity, workCenterId, description } =
      request;

    deviceRequestTicket.name = name;
    deviceRequestTicket.description = description;
    deviceRequestTicket.userId = uId;
    deviceRequestTicket.device = new Types.ObjectId(deviceId);
    deviceRequestTicket.quantity = quantity;
    deviceRequestTicket.workCenterId = workCenterId;

    return deviceRequestTicket;
  }

  async getDetail(id: string): Promise<DeviceRequestTicket> {
    const findQuery = findByIdAndPopulateHistory(
      this.deviceRequestTicketModel,
      id,
    );

    const queryResult = await findQuery
      .lookup({
        from: 'devices',
        localField: 'device',
        foreignField: '_id',
        as: 'device',
        pipeline: [
          {
            $project: {
              id: DOCUMENT_CONST.ID_PATH,
              _id: FieldVisibility.Hidden,
              code: FieldVisibility.Visible,
              name: FieldVisibility.Visible,
              type: FieldVisibility.Visible,
            },
          },
        ],
      })
      .unwind({
        path: '$device',
        preserveNullAndEmptyArrays: true,
      })
      .exec();

    return queryResult[0];
  }

  async changeStatus(
    id: string,
    status: DeviceRequestTicketStatus,
    history: History,
  ): Promise<string> {
    const query = this.deviceRequestTicketModel.findOne({
      _id: new Types.ObjectId(id),
    });

    const requestTicket = await query.exec();

    if (!requestTicket) return null;

    requestTicket.status = status;
    requestTicket.histories.push(history);
    await requestTicket.save();

    return requestTicket.id;
  }

  async delete(id: string): Promise<DeviceRequestTicket> {
    const requestTicket = await this.deviceRequestTicketModel
      .findOne({
        _id: new Types.ObjectId(id),
      })
      .exec();

    if (!requestTicket) return null;

    return requestTicket.remove();
  }

  async getList(
    request: ListDeviceRequestsRequestDto,
    isGetAll: boolean,
  ): Promise<any> {
    const { keyword, sort, filter, type, take, skip } = request;

    const filterObj = {};
    let sortObj = {};

    let query = this.deviceRequestTicketModel.aggregate([
      {
        $lookup: {
          from: 'devices',
          localField: 'device',
          foreignField: '_id',
          as: 'devices',
        },
      },
      {
        $lookup: {
          from: 'deviceAssignments',
          localField: '_id',
          foreignField: 'deviceRequestId',
          as: 'deviceAssignments',
          pipeline: [
            {
              $match: {
                status: {
                  $ne: DEVICE_ASIGNMENTS_STATUS_ENUM.RETURNED,
                },
              },
            },
          ],
        },
      },
    ]);

    const deviceRequestTypeReturn = DeviceRequestType.Return;

    const returnTicketQueryPipeline = [
      {
        $lookup: {
          from: 'deviceAssignments',
          localField: 'deviceAssignments',
          foreignField: '_id',
          as: 'deviceAssignments',
        },
      },
      {
        $unwind: {
          path: '$deviceAssignments',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'deviceRequestTickets',
          localField: 'deviceAssignments.deviceRequestId',
          foreignField: '_id',
          as: 'deviceAssignments.deviceRequestTicket',
        },
      },
      {
        $unwind: {
          path: '$deviceAssignments.deviceRequestTicket',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'devices',
          localField: 'deviceAssignments.deviceRequestTicket.device',
          foreignField: '_id',
          as: 'deviceAssignments.device',
        },
      },
      {
        $unwind: {
          path: '$deviceAssignments.device',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          devices: '$deviceAssignments.device',
        },
      },
      {
        $project: {
          status: FieldVisibility.Visible,
          histories: FieldVisibility.Visible,
          userId: FieldVisibility.Visible,
          code: FieldVisibility.Visible,
          name: FieldVisibility.Visible,
          createdAt: FieldVisibility.Visible,
          updatedAt: FieldVisibility.Visible,
          devices: {
            userId: '$deviceAssignments.userId',
            serial: '$deviceAssignments.serial',
            _id: FieldVisibility.Visible,
            code: FieldVisibility.Visible,
            name: FieldVisibility.Visible,
            type: FieldVisibility.Visible,
            model: FieldVisibility.Visible,
          },
          quantity: FieldVisibility.Visible,
        },
      },
      {
        $group: {
          _id: DOCUMENT_CONST.ID_PATH,
          status: {
            $first: '$status',
          },
          code: {
            $first: '$code',
          },
          name: {
            $first: '$name',
          },
          createdAt: {
            $first: '$createdAt',
          },
          updatedAt: {
            $first: '$updatedAt',
          },
          devices: {
            $push: '$devices',
          },
          quantity: {
            $first: '$quantity',
          },
          histories: {
            $push: '$histories',
          },
        },
      },
    ];

    if (type == undefined) {
      query.append({
        $unionWith: {
          coll: 'deviceReturnTickets',
          pipeline: returnTicketQueryPipeline,
        },
      });
    } else if (type == deviceRequestTypeReturn) {
      query = this.deviceReturnTicketModel.aggregate(returnTicketQueryPipeline);
    }

    const codeColumn = DEVICE_REQUEST_CONST.CODE.COLUMN;
    const nameColumn = DEVICE_REQUEST_CONST.NAME.COLUMN;
    const createdAtColumn = BASE_ENTITY_CONST.CREATED_AT.COLUMN;
    const updatedAtColumn = BASE_ENTITY_CONST.UPDATED_AT.COLUMN;

    const deviceConst = DEVICE_REQUEST_CONST.DEVICE;
    const deviceCodeColumn = deviceConst.CODE.COLUMN;
    const deviceNameColumn = deviceConst.NAME.COLUMN;
    const deviceSerialColumn = deviceConst.SERIAL.COLUMN;

    filterObj['$and'] = [
      {
        deletedAt: null,
      },
    ];

    if (!isEmpty(keyword)) {
      filterObj['$or'] = [
        { code: { $regex: '.*' + keyword + '.*', $options: 'i' } },
        { name: { $regex: '.*' + keyword + '.*', $options: 'i' } }
      ];
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        const text = item.text?.toLowerCase();
        switch (item.column) {
          case codeColumn:
            filterObj['$and'].push({
              code: { $regex: '.*' + text + '.*', $options: 'i' },
            });
            break;
          case nameColumn:
            filterObj['$and'].push({
              name: { $regex: '.*' + text + '.*', $options: 'i' },
            })
            break;
          case deviceCodeColumn:
            filterObj['$and'].push({
              'devices.code': { $regex: '.*' + text + '.*', $options: 'i' },
            });
            break;
          case deviceNameColumn:
            filterObj['$and'].push({
              'devices.name': { $regex: '.*' + text + '.*', $options: 'i' },
            });
            break;
          case deviceSerialColumn:
            filterObj['$and'].push({
              'devices.serial': { $regex: '.*' + text + '.*', $options: 'i' },
            });
            break;
          case createdAtColumn:
            filterObj['$and'].push({
              createdAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lte: moment(item.text.split('|')[1]).endOf('day').toDate(),
              },
            });
            break;
          case updatedAtColumn:
            filterObj['$and'].push({
              updatedAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lte: moment(item.text.split('|')[1]).endOf('day').toDate(),
              },
            });
            break;
          default:
            break;
        }
      });
    }

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        const order = item.order?.toSortOrder();

        switch (item.column) {
          case codeColumn:
            sortObj[codeColumn] = order;
            break;
          case deviceCodeColumn:
            sortObj['firstDevice.code'] = order;
            break;
          case deviceNameColumn:
            sortObj['firstDevice.name'] = order;
            break;
          case deviceSerialColumn:
            sortObj['firstDevice.serial'] = order;
            break;
          case createdAtColumn:
            sortObj[createdAtColumn] = order;
            break;
          case updatedAtColumn:
            sortObj[updatedAtColumn] = order;
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: SortOrder.Descending };
    }

    query.append({ $match: filterObj });

    const prependPipeline = [
      {
        $project: {
          _id: FieldVisibility.Hidden,
          id: DOCUMENT_CONST.ID_PATH,
          status: FieldVisibility.Visible,
          code: FieldVisibility.Visible,
          name: FieldVisibility.Visible,
          createdAt: FieldVisibility.Visible,
          updatedAt: FieldVisibility.Visible,
          workCenterId: FieldVisibility.Visible,
          devices: {
            _id: FieldVisibility.Visible,
            code: FieldVisibility.Visible,
            name: FieldVisibility.Visible,
            userId: FieldVisibility.Visible,
            serial: FieldVisibility.Visible,
            type: FieldVisibility.Visible,
            model: FieldVisibility.Visible,
          },
          userId: FieldVisibility.Visible,
          quantity: FieldVisibility.Visible,
          actualImportQuantity: FieldVisibility.Visible,
          firstDevice: {
            $first: '$devices',
          },
          deviceAssignments: FieldVisibility.Visible,
        },
      },
    ];

    let queryResult: any;

    if (isGetAll) {
      queryResult = (
        await query
          .buildPaginationQuery(null, null, sortObj, prependPipeline)
          .exec()
      )[0];
    } else {
      queryResult = (
        await query
          .buildPaginationQuery(skip, take, sortObj, prependPipeline)
          .exec()
      )[0];
    }

    return {
      tickets: queryResult.data,
      count: queryResult.total,
    };
  }

  async update(request: any, history: History): Promise<DeviceRequestTicket> {
    const { id } = request;

    let requestTicket = await this.deviceRequestTicketModel.findById(id);

    requestTicket = this.updateDocument(requestTicket, request);
    requestTicket.histories.push(history);

    return await requestTicket.save();
  }

  async findOneById(id: string): Promise<DeviceRequestTicket> {
    return await this.deviceRequestTicketModel
      .findById(new Types.ObjectId(id))
      .exec();
  }

  findAllWithPopulate(
    condition: any,
    populate: string,
  ): Promise<DeviceRequestTicket[]> {
    return this.deviceRequestTicketModel
      .find(condition)
      .populate(populate)
      .exec();
  }
}

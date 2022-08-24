import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DeviceReturnTicketRepositoryInterface } from '@components/device-request/interface/device-return-ticket.repository.interface';
import { History } from '../../models/history/history.model';
import { CreateDeviceReturnTicketRequestDto } from '@components/device-request/dto/request/return-ticket/create-device-return-ticket.request.dto';
import { DeviceReturnTicket } from '../../models/device-return-ticket/device-return-ticket.model';
import { DeviceReturnTicketStatus } from '../../models/device-return-ticket/device-return-ticket.schema';
import { findByIdAndPopulateHistory } from '@utils/extensions/mongoose.extension';
import { SortOrder } from '@constant/database.constant';

@Injectable()
export class DeviceReturnTicketRepository
  extends BaseAbstractRepository<DeviceReturnTicket>
  implements DeviceReturnTicketRepositoryInterface
{
  constructor(
    @InjectModel('DeviceReturnTicket')
    private readonly deviceReturnTicketModel: Model<DeviceReturnTicket>,
  ) {
    super(deviceReturnTicketModel);
  }

  async getLatest(): Promise<DeviceReturnTicket> {
    return await this.deviceReturnTicketModel
      .findOne(null, 'code', {
        sort: {
          _id: SortOrder.Descending,
        },
      })
      .exec();
  }

  async createDocument(
    request: CreateDeviceReturnTicketRequestDto,
    code: string,
  ): Promise<DeviceReturnTicket> {
    const ticket = new this.deviceReturnTicketModel();

    ticket.code = code;

    return this.updateDocument(ticket, request);
  }

  updateDocument(
    deviceReturnTicket: DeviceReturnTicket & { _id: any },
    request: CreateDeviceReturnTicketRequestDto,
  ): DeviceReturnTicket & { _id: any } {
    const { deviceAssignmentIds, name, description } = request;

    deviceReturnTicket.name = name;
    deviceReturnTicket.description = description;
    deviceReturnTicket.deviceAssignments = deviceAssignmentIds.map((id) => {
      return new Types.ObjectId(id);
    });

    return deviceReturnTicket;
  }

  async getDetail(id: string): Promise<DeviceReturnTicket> {
    const findQuery = findByIdAndPopulateHistory(
      this.deviceReturnTicketModel,
      id,
    );

    const queryResult = await findQuery
      .lookup({
        from: 'deviceAssignments',
        localField: 'deviceAssignments',
        foreignField: '_id',
        as: 'deviceAssignments',
        pipeline: [
          {
            $lookup: {
              from: 'deviceRequestTickets',
              localField: 'deviceRequestId',
              foreignField: '_id',
              as: 'deviceRequestTicket',
              pipeline: [
                {
                  $lookup: {
                    from: 'devices',
                    localField: 'device',
                    foreignField: '_id',
                    as: 'device',
                  },
                },
                {
                  $unwind: {
                    path: '$device',
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$deviceRequestTicket',
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
      })
      .exec();

    return queryResult[0];
  }

  async changeStatus(
    id: string,
    status: DeviceReturnTicketStatus,
    history: History,
  ): Promise<string> {
    const returnTicket = await this.deviceReturnTicketModel
      .findOne({
        _id: new Types.ObjectId(id),
      })
      .exec();

    if (!returnTicket) return null;

    returnTicket.status = status;
    returnTicket.histories.push(history);
    await returnTicket.save();

    return returnTicket.id;
  }

  async delete(id: string): Promise<DeviceReturnTicket> {
    const returnTicket = await this.deviceReturnTicketModel
      .findOne({
        _id: new Types.ObjectId(id),
      })
      .exec();

    if (!returnTicket) return null;

    return returnTicket.remove();
  }

  async update(request: any, history: History): Promise<DeviceReturnTicket> {
    const { id } = request;

    let returnTicket = await this.deviceReturnTicketModel.findById(id);

    returnTicket = this.updateDocument(returnTicket, request);
    returnTicket.histories.push(history);

    return await returnTicket.save();
  }

  async findOneById(id: string): Promise<DeviceReturnTicket> {
    return await this.deviceReturnTicketModel
      .findById(new Types.ObjectId(id))
      .exec();
  }

  findAllWithPopulate(
    condition: any,
    populate: any,
  ): Promise<DeviceReturnTicket[]> {
    return this.deviceReturnTicketModel
      .find(condition)
      .populate(populate)
      .exec();
  }
}

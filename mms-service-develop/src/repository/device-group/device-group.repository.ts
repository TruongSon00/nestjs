import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { DeviceGroup } from '../../models/device-group/device-group.model';
import { DeviceGroupRepositoryInterface } from '@components/device-group/interface/device-group.repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetListDeviceGroupRequestDto } from '@components/device-group/dto/request/get-list-device-group.request.dto';
import { isEmpty } from 'lodash';
import { DeviceGroupStatusConstant } from '@components/device-group/device-group.constant';
import { FieldVisibility } from '@constant/database.constant';
import * as moment from 'moment';

@Injectable()
export class DeviceGroupRepository
  extends BaseAbstractRepository<DeviceGroup>
  implements DeviceGroupRepositoryInterface
{
  constructor(
    @InjectModel('DeviceGroup')
    private readonly deviceGroupModel: Model<DeviceGroup>,
  ) {
    super(deviceGroupModel);
  }
  createDocument(param: any): DeviceGroup {
    const document = new this.deviceGroupModel();
    document.code = param.code;
    document.name = param.name;
    document.responsibleUserIds = param.responsibleUserIds;
    document.responsibleMaintenanceTeam = param.responsibleMaintenanceTeam;
    document.description = param.description;
    document.status = param.status;
    return document;
  }
  async getList(request: GetListDeviceGroupRequestDto): Promise<any> {
    const { keyword, sort, filter, take, skip } = request;
    let filterObj = {};
    let sortObj = {};
    if (!isEmpty(keyword)) {
      filterObj = {
        $or: [
          { code: { $regex: '.*' + keyword + '.*', $options: 'i' } },
          { name: { $regex: '.*' + keyword + '.*', $options: 'i' } },
        ],
      };
    }
    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        const value = item ? item.text : null;
        switch (item.column) {
          case 'code':
            filterObj = {
              ...filterObj,
              $and: [
                {
                  code: {
                    $regex: '.*' + value + '.*',
                    $options: 'i',
                  },
                },
              ],
            };
            break;
          case 'name':
            filterObj = {
              ...filterObj,
              $and: [
                {
                  name: {
                    $regex: '.*' + value + '.*',
                    $options: 'i',
                  },
                },
              ],
            };
            break;
          case 'status':
            filterObj = {
              ...filterObj,
              $and: [{ status: parseInt(value) }],
            };
            break;
          case 'createdAt':
            filterObj = {
              ...filterObj,
              createdAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lte: moment(item.text.split('|')[1]).endOf('day').toDate(),
              },
            };
            break;
          case 'updatedAt':
            filterObj = {
              ...filterObj,
              updatedAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lte: moment(item.text.split('|')[1]).endOf('day').toDate(),
              },
            };
            break;
          default:
            break;
        }
      });
    }
    const query = this.deviceGroupModel.aggregate().match(filterObj);
    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        switch (item.column) {
          case 'code':
            sortObj = { code: item.order?.toSortOrder() };
            break;
          case 'name':
            sortObj = { name: item.order?.toSortOrder() };
            break;
          case 'status':
            sortObj = { status: item.order?.toSortOrder() };
            break;
          case 'createdAt':
            sortObj = { createdAt: item.order?.toSortOrder() };
            break;
          case 'updatedAt':
            sortObj = { updatedAt: item.order?.toSortOrder() };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: -1 };
    }
    const queryResult = (
      await query
        .project({
          id: '$_id',
          _id: FieldVisibility.Visible,
          code: FieldVisibility.Visible,
          name: FieldVisibility.Visible,
          description: FieldVisibility.Visible,
          status: FieldVisibility.Visible,
          createdAt: FieldVisibility.Visible,
          updatedAt: FieldVisibility.Visible,
          responsibleUserIds: FieldVisibility.Visible,
          responsibleMaintenanceTeam: FieldVisibility.Visible,
        })
        .buildPaginationQuery(skip, take, sortObj)
        .exec()
    )[0];

    return { result: queryResult.data, count: queryResult.total };
  }

  async findDeviceGroupConfirmed(): Promise<any> {
    const result = await this.deviceGroupModel.find({
      status: DeviceGroupStatusConstant.CONFIRMED,
    });
    return result;
  }

  async findMaintenanceTeam(id: string): Promise<any> {
    return this.deviceGroupModel.findOne({ responsibleMaintenanceTeam: id });
  }

  async findOneByCode(code: string): Promise<any> {
    const result = await this.deviceGroupModel
      .findOne({ code: code })
      .populate('histories');
    return result;
  }

  async detail(id: string): Promise<any> {
    const result = await this.deviceGroupModel
      .findById(id)
      .populate('histories');
    return result;
  }

  async update(param: any): Promise<any> {
    const result = await this.deviceGroupModel
      .findByIdAndUpdate(param._id, {
        description: param.description,
        name: param.name,
        responsibleUserIds: param.responsibleUserIds,
        responsibleMaintenanceTeam: param.responsibleMaintenanceTeam,
        status: param.status,
      })
      .populate('histories');
    result.histories.push(param.history);
    return await result.save();
  }
  async delete(id: string): Promise<any> {
    const result = await this.deviceGroupModel.findByIdAndDelete(id);
    return result;
  }

  async getListDeviceGroupByIds(ids: string[]): Promise<any> {
    return await this.deviceGroupModel.find({ _id: { $in: ids } });
  }
}

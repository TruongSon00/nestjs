import { RegionRepositoryInterface } from '@components/region/interface/region.repository.interface';
import { FieldVisibility } from '@constant/database.constant';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Model } from 'mongoose';
import { RegionModel } from 'src/models/region/region.model';

@Injectable()
export class RegionRepository
  extends BaseAbstractRepository<RegionModel>
  implements RegionRepositoryInterface
{
  constructor(
    @InjectModel('RegionModel')
    private readonly regionModel: Model<RegionModel>,
  ) {
    super(regionModel);
  }

  async list(request: any): Promise<any> {
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
      filter.forEarch((item) => {
        const value = item ? item.text : null;
        switch (item.column) {
          case 'code':
            filterObj = {
              ...filterObj,
              code: {
                $regex: '.*' + value + '.*',
                $options: 'i',
              },
            };
            break;
          case 'name':
            filterObj = {
              ...filterObj,
              name: {
                $regex: '.*' + value + '.*',
                $options: 'i',
              },
            };
            break;
          case 'createdAt':
            filterObj = {
              ...filterObj,
              createdAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lte: moment(item.text.split('|')[1]).startOf('day').toDate(),
              },
            };
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
          case 'code':
            sortObj = { code: order };
            break;
          case 'name':
            sortObj = { name: order };
            break;
          case 'createdAt':
            sortObj = { createdAt: order };
            break;
          case 'updatedAt':
            sortObj = { updatedAt: order };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: -1 };
    }

    const result = await this.regionModel
      .find({ deletedAt: null })
      .find(filterObj)
      .populate({
        path: 'interRegion',
      })
      .limit(take)
      .skip(skip)
      .sort(sortObj)
      .exec();

    const total: number = await this.regionModel
      .find({ deletedAt: null })
      .find(filterObj)
      .countDocuments()
      .exec();
    return { data: result, count: total };
  }

  async import(bulkOps: any): Promise<any> {
    return await this.regionModel.bulkWrite(bulkOps);
  }
}

import { Model } from 'mongoose';
import { repositoryInterface } from './repository.interface';

export abstract class baseRepositoryAbstract<T>
  implements repositoryInterface<T>
{
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  getListWithAggregate(
    filter: object,
    lookup: any,
    sort: any,
    limit?: number,
  ): Promise<T[] | any> {
    const query = this.model.aggregate([
      { $match: filter },
      { $lookup: lookup },
      { $sort: sort },
    ]);
    if (limit) query.limit(limit);
    return query.exec();
  }

  async create(collection: object): Promise<any> {
    return await this.model.create(collection);
  }
  async getList(filter: object): Promise<T[]> {
    return await this.model.find(filter);
  }
  async edit(id: any, data: any): Promise<any> {
    return await this.model.findByIdAndUpdate(id, data);
  }
  async getById(id: any): Promise<T> {
    return await this.model.findById(id);
  }
  getByIdWithAggregate(
    filter: object,
    lookup: any,
    sort: any,
    unwind?: string,
    limit?: number,
  ): Promise<T | any> {
    const query = this.model.aggregate([
      { $match: filter },
      { $unwind: unwind || '$_id' },
      { $lookup: lookup },
      { $sort: sort },
    ]);
    if (limit) query.limit(limit);
    return query.exec();
  }
  async delete(id: any): Promise<any> {
    return await this.model.findByIdAndDelete(id);
  }
}

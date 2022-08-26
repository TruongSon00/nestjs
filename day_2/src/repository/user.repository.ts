import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { baseRepositoryAbstract } from 'src/core/base.repository.abstract';
import { userModel } from 'src/model/user.model';
import { validateUserCreate } from 'src/requestValidate/requestUser';
import { IUserRepository } from 'src/components/user/interface/user.interface.repository';
import { departmentModel } from 'src/model/department.model';

@Injectable()
export class userRepository
  extends baseRepositoryAbstract<userModel>
  implements IUserRepository
{
  constructor(
    @InjectModel('userModel')
    private userModel: Model<userModel>,
    @InjectModel('departmentModel')
    private readonly departmentModel: Model<departmentModel>,
  ) {
    super(userModel);
  }

  async createUser(user: validateUserCreate): Promise<userModel> {
    const { name, age, departmentId } = user;
    const department = await this.departmentModel.findById(departmentId);
    if (!department) throw new Error('Department not found');

    let role = user.role;
    role = role || 0;
    const newUser = new this.userModel();
    newUser.name = name;
    newUser.age = age;
    newUser.department.push({ departmentId, role });
    return newUser.save();
  }
  async getUserById(id: any): Promise<userModel[]> {
    const query = this.userModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      { $unwind: '$department' },
      {
        $lookup: {
          from: 'departmentmodels',
          let: { department: '$department' },
          as: 'department',
          pipeline: [
            {
              $match: { $expr: { $eq: ['$$department.departmentId', '$_id'] } },
            },
            {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: ['$$ROOT', '$$department'],
                },
              },
            },
          ],
        },
      },
      { $sort: { 'department.createdAt': -1 } },
      {
        $group: {
          _id: '_id',
          user: { $first: '$$ROOT' },
          departments: { $push: { $first: '$department' } },
        },
      },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ['$user', { department: '$departments' }] },
        },
      },
    ]);
    return await query.exec();
  }
}

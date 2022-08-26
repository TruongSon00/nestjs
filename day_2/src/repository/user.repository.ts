import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { baseRepositoryAbstract } from 'src/core/base.repository.abstract';
import { userModel } from 'src/model/user.model';
import { validateUserCreate } from 'src/requestValidate/requestUser';
import { IUserRepository } from 'src/components/user/interface/user.interface.repository';

@Injectable()
export class userRepository
  extends baseRepositoryAbstract<userModel>
  implements IUserRepository
{
  constructor(
    @InjectModel('userModel')
    private userModel: Model<userModel>,
  ) {
    super(userModel);
  }
  getByIdWithAggregate(
    filter: object,
    lookup: object,
    sort: object,
    unwind?: string,
    limit?: number,
  ): Promise<userModel> {
    return;
  }
  async createUser(user: validateUserCreate): Promise<userModel> {
    const { name, age, departmentId } = user;
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
          as: 'departments',
          pipeline: [
            {
              $match: { $expr: { $eq: ['$$department.departmentId', '$_id'] } },
            },
            // {
            //   $replaceRoot: {
            //     newRoot: {
            //       $mergeObjects: [
            //         { $arrayElemAt: ['$departments', 0] },
            //         '$$department',
            //       ],
            //     },
            //   },
            // },
          ],
        },
      },
      { $sort: { 'department.createdAt': -1 } },
    ]);
    return await query.exec();
  }
}

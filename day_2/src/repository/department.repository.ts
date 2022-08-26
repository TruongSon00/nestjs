import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { baseRepositoryAbstract } from 'src/core/base.repository.abstract';
import { IDepartmentRepository } from 'src/components/department/interface/department.repository.interface';
import { departmentModel } from 'src/model/department.model';
import { validateDepartmentCreate } from 'src/requestValidate/requestDepartment';
import { Model, Types } from 'mongoose';
import { userModel } from 'src/model/user.model';

@Injectable()
export class departmentRepository
  extends baseRepositoryAbstract<departmentModel>
  implements IDepartmentRepository
{
  constructor(
    @InjectModel('departmentModel')
    private readonly departmentModel: Model<departmentModel>,
    @InjectModel('userModel')
    private readonly userModel: Model<userModel>,
  ) {
    super(departmentModel);
  }
  getByIdDepartmentAggregate(id: string): Promise<userModel[]> {
    const query = this.userModel.aggregate([
      { $unwind: '$department' },
      { $match: { 'department.departmentId': new Types.ObjectId(id) } },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$department', '$$ROOT'],
          },
        },
      },
      { $project: { department: 0 } },

      {
        $lookup: {
          from: 'departmentmodels',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department',
        },
      },
    ]);
    return query.exec();
  }
  async delDepartment(id: string): Promise<any> {
    try {
      await this.departmentModel.findByIdAndDelete(id);

      await this.userModel.updateMany(
        {},
        { $pull: { department: { departmentId: id } } },
      );
      return new Promise((resolve) => {
        resolve('delete succes');
      });
    } catch (error) {
      throw new Error('Loi database');
    }
  }

  createDepartment(data: validateDepartmentCreate): Promise<departmentModel> {
    const { name, descript } = data;
    const newDepartment = new this.departmentModel();
    newDepartment.name = name;
    newDepartment.descript = descript;
    return newDepartment.save();
  }
}

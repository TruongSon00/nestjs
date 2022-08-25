import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { baseRepositoryAbstract } from 'src/core/base.repository.abstract';
import { IDepartmentRepository } from 'src/components/department/interface/department.repository.interface';
import { departmentModel } from 'src/model/department.model';
import { validateDepartmentCreate } from 'src/requestValidate/requestDepartment';
import { Model } from 'mongoose';
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
  async delDepartment(id: string): Promise<any> {
    this.departmentModel.findByIdAndDelete(id);
    const users = await this.userModel.updateMany({ 'department._id': id }, {department: });
    
    users.save()
    users.map((user) => {
      user.department.id(id
    });
  }

  createDepartment(data: validateDepartmentCreate): Promise<departmentModel> {
    const { name, descript } = data;
    const newDepartment = new this.departmentModel();
    newDepartment.name = name;
    newDepartment.descript = descript;
    return newDepartment.save();
  }
}

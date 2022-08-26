import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IRoleRepository } from 'src/components/role/interface/role.repository.interface';
import { baseRepositoryAbstract } from 'src/core/base.repository.abstract';
import { userModel } from 'src/model/user.model';
@Injectable()
export class roleRepository
  extends baseRepositoryAbstract<userModel>
  implements IRoleRepository
{
  constructor(
    @InjectModel('userModel')
    private readonly userModel: Model<userModel>,
  ) {
    super(userModel);
  }
  async editRoleUser(
    userId: string,
    departmentId: string,
    role: number,
  ): Promise<userModel> {
    const user = await this.userModel.findById(userId);
    user.department.map((department, index) => {
      if (department.departmentId.toHexString() == departmentId)
        user.department[index].role = role;
    });
    return user.save();
  }
  async checkDepartment(
    userId: string,
    departmentId: string,
  ): Promise<userModel> {
    const user = await this.userModel.findOne({
      _id: userId,
      'department.departmentId': departmentId,
    });
    return user;
  }
}

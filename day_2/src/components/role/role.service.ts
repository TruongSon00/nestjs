import { Model } from 'mongoose';
import { IRoleService } from './interface/role.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { IRoleRepository } from './interface/role.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { departmentModel } from 'src/model/department.model';
import { userModel } from 'src/model/user.model';
@Injectable()
export class RoleService implements IRoleService {
  constructor(
    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,
    @InjectModel('departmentModel')
    private readonly departmentModel: Model<departmentModel>,
    @InjectModel('userModel')
    private readonly userModel: Model<userModel>,
  ) {}

  async editRoleUser(
    userId: string,
    departmentId: string,
    role: number,
  ): Promise<any> {
    const user = await this.roleRepository.checkDepartment(
      userId,
      departmentId,
    );
    if (!user) throw new Error('ban da chua co trong phong ban');
    return this.roleRepository.editRoleUser(userId, departmentId, role);
  }

  async createRoleUser(
    userId: string,
    departmentId: string,
    role: number,
  ): Promise<any> {
    const department = await this.departmentModel.findById(departmentId);
    if (!department) throw new Error('department not found');

    const user = await this.roleRepository.checkDepartment(
      userId,
      departmentId,
    );
    if (user) throw new Error('ban da o trong phong ban');

    return this.roleRepository.editById(userId, {
      $push: { department: { departmentId, role } },
    });
  }
  async delRoleUser(userId: string, departmentId: string): Promise<any> {
    const user = await this.roleRepository.checkDepartment(
      userId,
      departmentId,
    );
    if (!user) throw new Error('ban chua co trong phong ban');
    return this.roleRepository.editById(userId, {
      $pull: { department: { departmentId } },
    });
  }
}

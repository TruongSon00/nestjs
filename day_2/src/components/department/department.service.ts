import { Inject, Injectable } from '@nestjs/common';
import { filter } from 'rxjs';
import { departmentModel } from 'src/model/department.model';
import { userModel } from 'src/model/user.model';
import {
  validateDepartmentCreate,
  validateDepartmentEdit,
} from 'src/requestValidate/requestDepartment';
import { IDepartmentRepository } from './interface/department.repository.interface';
import { IDepartmentService } from './interface/department.service.interface';

@Injectable()
export class DepartmentService implements IDepartmentService<departmentModel> {
  constructor(
    @Inject('IDepartmentRepository')
    private readonly departmentRepository: IDepartmentRepository,
  ) {}
  editDepartment(data: any): Promise<any> {
    return this.departmentRepository.edit(data.id, data);
  }
  delDepartment(id: any): Promise<any> {
    return this.departmentRepository.delDepartment(id);
  }
  listDepartment(): Promise<any> {
    return this.departmentRepository.getList({});
  }
  getDepartmentById(id: string): Promise<userModel[]> {
    return this.departmentRepository.getByIdDepartmentAggregate(id);
  }
  createDepartment(data: validateDepartmentCreate): Promise<departmentModel> {
    return this.departmentRepository.createDepartment(data);
  }
}

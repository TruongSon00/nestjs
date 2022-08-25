import { Inject, Injectable } from '@nestjs/common';
import { departmentModel } from 'src/model/department.model';
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
  editDepartment(id: any, data: object): Promise<any> {
    return this.departmentRepository.edit(id, data);
  }
  delDepartment(id: any): Promise<any> {
    // this.departmentRepository.de
    throw new Error('');
  }
  listDepartment(data: object): Promise<any> {
    throw new Error('Method not implemented.');
  }
  getDepartmentById(id: any): Promise<departmentModel> {
    throw new Error('Method not implemented.');
  }
  createDepartment(data: validateDepartmentCreate): Promise<departmentModel> {
    return this.departmentRepository.createDepartment(data);
  }
}

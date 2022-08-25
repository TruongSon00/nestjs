import { Types, ObjectId } from 'mongoose';
import Ajv from 'ajv';
import { IRoleService } from './interface/role.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { IRoleRepository } from './interface/role.repository.interface';
@Injectable()
export class RoleService implements IRoleService {
  constructor(
    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  editRoleUser(userId: string, departmentId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  createRoleUser(
    userId: string,
    departmentId: string,
    role: number,
  ): Promise<any> {
    throw new Error('Method not implemented.');
  }
  delRoleUser(userId: string, departmentId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}

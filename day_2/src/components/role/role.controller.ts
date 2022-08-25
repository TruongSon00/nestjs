import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import {
  validateRoleAdd,
  validateRoleDel,
  validateRoleEdit,
} from 'src/requestValidate/requestRole';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  create(@Body() data: validateRoleAdd): Promise<any> {
    const { userId, departmentId, role } = data;
    return this.roleService.createRoleUser(userId, departmentId, role);
  }
  @Put()
  edit(@Body() data: validateRoleEdit): Promise<any> {
    const { userId, departmentId } = data;
    return this.roleService.editRoleUser(userId, departmentId);
  }

  @Delete()
  del(@Body() data: validateRoleDel): Promise<any> {
    const { userId, departmentId } = data;
    return this.roleService.delRoleUser(userId, departmentId);
  }
}

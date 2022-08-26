import {
  Body,
  Controller,
  Delete,
  Inject,
  Injectable,
  Post,
  Put,
} from '@nestjs/common';
import {
  validateRoleAdd,
  validateRoleDel,
  validateRoleEdit,
} from 'src/requestValidate/requestRole';
import { IRoleService } from './interface/role.service.interface';

@Injectable()
@Controller('role')
export class RoleController {
  constructor(
    @Inject('IRoleService')
    private readonly roleService: IRoleService,
  ) {}
  @Post()
  create(@Body() data: validateRoleAdd): Promise<any> {
    const { userId, departmentId, role } = data;
    return this.roleService.createRoleUser(userId, departmentId, role);
  }
  @Put()
  edit(@Body() data: validateRoleEdit): Promise<any> {
    const { userId, departmentId, role } = data;
    return this.roleService.editRoleUser(userId, departmentId, role);
  }

  @Delete()
  del(@Body() data: validateRoleDel): Promise<any> {
    const { userId, departmentId } = data;
    return this.roleService.delRoleUser(userId, departmentId);
  }
}

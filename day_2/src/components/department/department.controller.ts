import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Injectable,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { departmentModel } from 'src/model/department.model';
import { checkId } from 'src/requestValidate/requestCommon';
import {
  validateDepartmentCreate,
  validateDepartmentEdit,
  validateDepartmentFindId,
} from 'src/requestValidate/requestDepartment';
import { IDepartmentService } from './interface/department.service.interface';

@Injectable()
@Controller('department')
export class DepartmentController {
  constructor(
    @Inject('IDepartmentService')
    private departmentService: IDepartmentService<departmentModel>,
  ) {}

  @Delete(':id')
  delete(@Param('id') id: any): Promise<any> {
    checkId(id);
    return this.departmentService.delDepartment(id);
  }
  @Post()
  create(@Body() data: validateDepartmentCreate): Promise<any> {
    return this.departmentService.createDepartment(data);
  }

  @Put('edit')
  edit(@Body() data: validateDepartmentEdit): Promise<any> {
    return this.departmentService.editDepartment(data);
  }

  @Get()
  getList(): Promise<any> {
    return this.departmentService.listDepartment();
  }
  @Get(':id')
  getById(@Param('id') id: any): Promise<any> {
    checkId(id);
    return this.departmentService.getDepartmentById(id);
  }
}

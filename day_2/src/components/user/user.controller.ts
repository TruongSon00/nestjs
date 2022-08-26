import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Put,
  Injectable,
  Inject,
} from '@nestjs/common';
import { userModel } from 'src/model/user.model';
import { checkId } from 'src/requestValidate/requestCommon';
import {
  validateUserCreate,
  validateUserEdit,
} from 'src/requestValidate/requestUser';
import { IUserService } from './interface/user.service.interface';

@Injectable()
@Controller('user')
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService<userModel>,
  ) {}

  @Get()
  getList(): Promise<userModel[]> {
    return this.userService.getList({});
  }

  @Put(':id')
  edit(@Param('id') id: any, @Body() data: validateUserEdit): Promise<any> {
    checkId(id);
    return this.userService.edit(id, data);
  }

  @Get(':id')
  getById(@Param('id') id: any): Promise<any> {
    checkId(id);
    return this.userService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: any): Promise<any> {
    checkId(id);
    return this.userService.delete(id);
  }

  @Post()
  async create(@Body() user: validateUserCreate) {
    console.log(typeof user.age);
    return await this.userService.create(user);
  }
}

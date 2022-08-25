import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Put,
  Inject,
  Injectable,
} from '@nestjs/common';
import { userModel } from 'src/model/user.model';
import {
  validateUserCreate,
  validateUserEdit,
  validateUserFindId,
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

  @Put()
  edit(id: validateUserFindId, data: validateUserEdit): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get(':id')
  getById(@Param('id') id: validateUserFindId): Promise<any> {
    return this.userService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: validateUserFindId): Promise<any> {
    return this.userService.delete(id);
  }

  @Post()
  async create(@Body() user: validateUserCreate) {
    console.log(typeof user.age);
    return await this.userService.create(user);
  }
}

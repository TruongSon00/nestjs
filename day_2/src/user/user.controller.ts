import { Controller, Post, Body, Param, Get, Delete, Put, Inject, Injectable } from '@nestjs/common';
import { IUser } from 'src/model/user.model';
import { validateRequestCreate, validateRequestEdit, validateRequestFindId } from 'src/requestValidate/requestUser';
import { IUserService } from './interface/user.service.interface';
import { UserService } from './user.service';


@Injectable()
@Controller('user')
export class UserController {

    constructor(
        @Inject('IUserService')
        private readonly userService: IUserService<IUser>) { }

    @Get()
    getList(): Promise<IUser[]> {
        return this.userService.getList({})

    }

    @Put()
    edit(id: validateRequestFindId, data: validateRequestEdit): Promise<any> {
        throw new Error('Method not implemented.');
    }

    @Get(':id')
    getById(@Param('id') id: validateRequestFindId): Promise<any> {
        return this.userService.getById(id)

    }

    @Delete(':id')
    delete(@Param('id') id: validateRequestFindId): Promise<any> {
        return this.userService.delete(id)
    }

    @Post()
    async create(@Body() user: validateRequestCreate) {

        return await this.userService.create(user)
    }

}

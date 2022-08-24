import { Controller, Post, Body, Param, Get, Delete, Put, Inject } from '@nestjs/common';
import { IService } from 'src/core/interfaceService';
import { IUser } from 'src/model/user.model';
import { IBaseRepository } from 'src/repository/IBaseRepository';
import { validateRequestCreate, validateRequestEdit, validateRequestFindId } from 'src/requestValidate/requestUser';
import { UserService } from './user.service';


@Controller('user')
export class UserController implements IService {

    constructor(private readonly userService: UserService) {
        this.userService = userService
    }

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

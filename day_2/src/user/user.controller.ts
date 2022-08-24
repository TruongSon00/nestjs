import { Controller, Post, Body, Param } from '@nestjs/common';
import { get } from 'http';
import { IService } from 'src/core/interfaceService';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
    userService: UserService
    constructor(userService: UserService) {
        this.userService = userService
    }

    @get()
    getList(): Promise<any> {
        return this.userService.getList({})

        return
    }
    edit(id: string, data: any): Promise<any> {
        throw new Error('Method not implemented.');
    }

    @get(':id')
    getById(@Param('id') id: string): Promise<any> {
        return this.userService.getById(id)

    }

    @delete(':id')
    delete(@Param('id') id: string): Promise<any> {
        return this.userService.delete(id)
        throw new Error('Method not implemented.');
    }

    @Post()
    async create(@Body() user: any) {

        return await this.userService.create(user)
    }

}

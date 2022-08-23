import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
    userService: UserService
    constructor(userService: UserService) {
        this.userService = userService
    }

    @Post()
    async createUser(@Body() user: any) {
        // console.log(user);
        const { name, age, departmentId, role } = user
        this.userService.create(name, age, departmentId, role)
    }
}

import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
    // imports: [
    //     provide: 'jlkjlk',
    //     class: 12331
    // ]
    controllers: [RoleController],
    providers: [RoleService],
})
export class RoleModule { }

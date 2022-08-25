import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/model/user.model';
import { roleRepository } from 'src/repository/role.repository';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'userModel', schema: userSchema }]),
  ],
  controllers: [RoleController],
  providers: [
    RoleService,
    { provide: 'IRoleRepository', useClass: roleRepository },
    // { provide: 'roleService', useClass: RoleService },
  ],
})
export class RoleModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DepartmentController } from './department/department.controller';
import { RoleController } from './role/role.controller';
import { RoleModule } from './role/role.module';
import { DepartmentService } from './department/department.service';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [UserModule, RoleModule, DepartmentModule],
  controllers: [AppController, DepartmentController, RoleController],
  providers: [AppService, DepartmentService],
})
export class AppModule { }

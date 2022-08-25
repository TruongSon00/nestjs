import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { departmentSchema } from 'src/model/department.model';
import { userSchema } from 'src/model/user.model';
import { departmentRepository } from 'src/repository/department.repository';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'departmentModel', schema: departmentSchema },
      { name: 'userModel', schema: userSchema },
    ]),
  ],
  providers: [
    DepartmentService,
    {
      provide: 'IDepartmentRepository',
      useClass: departmentRepository,
    },
    {
      provide: 'IDepartmentService',
      useClass: DepartmentService,
    },
  ],
  controllers: [DepartmentController],
})
export class DepartmentModule {}

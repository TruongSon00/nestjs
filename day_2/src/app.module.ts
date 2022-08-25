import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DepartmentController } from './department/department.controller';
import { RoleController } from './role/role.controller';
import { RoleModule } from './role/role.module';
import { DepartmentService } from './department/department.service';
import { DepartmentModule } from './department/department.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
dotenv.config()

@Module({
  imports: [UserModule, RoleModule,
    DepartmentModule,
    MongooseModule.forRoot(process.env.URL_DATABASE, {
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      }
    })
  ],
  controllers: [AppController, DepartmentController, RoleController],
  providers: [AppService, DepartmentService],
})
export class AppModule { }

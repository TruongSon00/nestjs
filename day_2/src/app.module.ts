import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './components/user/user.module';
import { RoleModule } from './components/role/role.module';
import { DepartmentModule } from './components/department/department.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    UserModule,
    RoleModule,
    DepartmentModule,
    MongooseModule.forRoot(
      process.env.URL_DATABASE,
      // {
      //   connectionFactory: (connection) => {
      //     connection.plugin(require('mongoose-autopopulate'));
      //     return connection;
      //   }
      // }
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

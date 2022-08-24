import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DepartmentController } from './department/department.controller';

@Module({
  imports: [UserModule],
  controllers: [AppController, DepartmentController],
  providers: [AppService],
})
export class AppModule { }

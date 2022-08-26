import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { departmentSchema } from 'src/model/department.model';
import { userSchema } from 'src/model/user.model';
import { userRepository } from 'src/repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'userModel', schema: userSchema }]),
    MongooseModule.forFeature([
      { name: 'departmentModel', schema: departmentSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    {
      provide: 'IUserRepository',
      useClass: userRepository,
    },
  ],
})
export class UserModule {}

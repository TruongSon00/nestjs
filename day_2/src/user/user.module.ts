import { Module } from '@nestjs/common';
import { userRepository } from 'src/repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    {
      provide: 'userService',
      useClass: UserService
    },
    {
      provide: 'IUserRepository',
      useClass: userRepository
    },
    {
      provide: 'IUserService',
      useClass: UserService
    }
  ],
})
export class UserModule { }

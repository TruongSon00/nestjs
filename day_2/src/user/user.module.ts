import { Module } from '@nestjs/common';
import { IUser } from 'src/model/user.model';
import { BaseUserRepository } from './BaseUserRepository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [BaseUserRepository],
  controllers: [UserController],
  providers: [UserService, BaseUserRepository],
})
export class UserModule { }

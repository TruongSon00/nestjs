import { Inject, Injectable } from '@nestjs/common';
import { userModel } from 'src/model/user.model';
import { Types } from 'mongoose';
import Ajv from 'ajv';
import {
  validateUserCreate,
  validateUserEdit,
  validateUserFindId,
} from 'src/requestValidate/requestUser';
import { IUserService } from './interface/user.service.interface';
import { IUserRepository } from './interface/user.interface.repository';
import { checkId } from '../../requestValidate/requestCommon';
@Injectable()
export class UserService implements IUserService<userModel> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  ajv = new Ajv();

  promissErr(message: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      reject(message);
    });
  }
  promissSucces(message: string, data: any): Promise<any> {
    return new Promise<any>((resolve) => {
      resolve({ message, data });
    });
  }

  // -------- them get list aggregate department -----------
  getList(filter: any): Promise<userModel[]> {
    const listuser = this.userRepository.getList(filter);
    return listuser;
  }

  create(data: validateUserCreate): Promise<any> {
    return this.userRepository.createUser(data);
  }

  edit(id: validateUserFindId, data: validateUserEdit): Promise<any> {
    const { name, age } = data;
    return this.userRepository.edit(id, { name, age });
  }

  async getById(id: string): Promise<any> {
    checkId(id);
    return this.userRepository.getById(id);
  }
  catch(err) {
    throw new Error(err);
  }

  delete(id: validateUserFindId): Promise<any> {
    checkId(id);

    this.userRepository.delete(id);
    return this.promissSucces('delete user succes', {});
  }
}

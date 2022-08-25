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

  checkId(id: any) {
    if (Types.ObjectId.isValid(id)) return new Types.ObjectId(id) == id;
    else return false;
  }

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

  async getById(id: validateUserFindId): Promise<any> {
    if (!this.checkId(id)) throw new Error('Du lieu khong hop le');
    try {
      const user = await this.userRepository.getById(id);
      return this.promissSucces('Get user succes', user);
    } catch (err) {
      throw new Error('Loi database');
    }
  }

  delete(id: validateUserFindId): Promise<any> {
    if (!this.checkId(id)) throw new Error('Du lieu khong hop le');

    this.userRepository.delete(id);
    return this.promissSucces('Get user succes', {});
  }
}

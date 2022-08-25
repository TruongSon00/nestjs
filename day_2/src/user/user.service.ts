import { Inject, Injectable } from '@nestjs/common';
import { IUser, User } from 'src/model/user.model';
import { Types } from 'mongoose';
import Ajv from 'ajv';
import { validateRequestCreate, validateRequestEdit, validateRequestFindId } from 'src/requestValidate/requestUser';
import { IUserService } from './interface/user.service.interface';
import { IUserRepository } from './interface/user.interface.repository';
@Injectable()
export class UserService implements IUserService<IUser> {

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository) {
  }

  ajv = new Ajv()

  promissErr(message: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      reject(message)
    })
  }
  promissSucces(message: string, data: any): Promise<any> {
    return new Promise<any>((resolve) => {
      resolve({ message, data })
    })
  }

  checkId(id: any) {
    if (Types.ObjectId.isValid(id))
      return (new Types.ObjectId(id) == id)
    else
      return false
  }

  getList(filter: Object): Promise<IUser[]> {
    const listuser = this.userRepository.getList(filter)
    return listuser
  }

  create(data: validateRequestCreate): Promise<any> {
    return this.userRepository.createUser(data)
  }

  edit(id: validateRequestFindId, data: validateRequestEdit): Promise<any> {

    let { name, age } = data
    return this.userRepository.edit(id, { name, age })


  }


  async getById(id: validateRequestFindId): Promise<any> {
    if (!this.checkId(id))
      throw new Error("Du lieu khong hop le");
    try {
      const user = await User.findById(id)
      return this.promissSucces('Get user succes', user)
    } catch (err) {
      throw new Error("Loi database");
    }
  }

  delete(id: validateRequestFindId): Promise<any> {
    if (!this.checkId(id))
      throw new Error("Du lieu khong hop le");

    User.findByIdAndDelete(id)
    return this.promissSucces('Get user succes', {})

  }
}

import { Inject, Injectable } from '@nestjs/common';
import { IUser, User } from 'src/model/user.model';
import { Types } from 'mongoose';
import Ajv from 'ajv';
import { IService } from '../core/interfaceService';
import { BaseUserRepository } from './BaseUserRepository';
import { validateRequestCreate, validateRequestEdit, validateRequestFindId } from 'src/requestValidate/requestUser';
@Injectable()
export class UserService implements IService {

  constructor(private readonly baseUserRepository: BaseUserRepository) {
    this.baseUserRepository = baseUserRepository
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
    const listuser = this.baseUserRepository.find(filter)
    return listuser
  }

  create(data: validateRequestCreate): Promise<any> {
    return this.baseUserRepository.create(data)
    // let { name, age, departmentId, role } = data

    // role = role * 1 || 0

    // if (!this.checkId(departmentId))
    //   return this.promissErr('DepartmentId invalid')
    // const innerArraySchema = {
    //   type: 'object',
    //   properties: {
    //     departmentId: { type: 'string' },
    //     role: { type: 'integer' }
    //   }, required: ['departmentId']
    // }
    // const schema = {
    //   type: 'object',
    //   properties: {
    //     name: { type: 'string' },
    //     age: { type: 'integer' },
    //     department: {
    //       type: 'array',
    //       'items': innerArraySchema
    //     }
    //   },
    //   required: ["name", 'age', 'department'],
    //   additionalProperties: false,
    // }
    // const user = {
    //   name, age: age * 1, department: [{ departmentId, role }]
    // }
    // const validate = this.ajv.compile(schema)
    // const valid = validate(user)
    // console.log({ valid, user });
    // if (valid) {
    //   const newUser = new User(user)
    //   return newUser.save()
    // } else

  }

  edit(id: validateRequestFindId, data: validateRequestEdit): Promise<any> {
    if (!this.checkId(id))
      throw new Error("Du lieu khong hop le");
    let { name, age } = data

    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
      required: ['name', 'age']
    }

    const validate = this.ajv.compile(schema)
    const valid = validate(data)
    if (!valid)
      throw new Error("Du lieu khong hop le");
    User.findByIdAndUpdate(id, { name, age })
    return this.promissSucces('update succes', {})

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

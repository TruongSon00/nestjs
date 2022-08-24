import { Injectable } from '@nestjs/common';
import { userInfo } from 'os';
import { User } from 'src/model/user.model';
import { Types, ObjectId } from 'mongoose';
import Ajv from 'ajv';
import { IService } from '../core/interfaceService';
@Injectable()
export class UserService implements IService {



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

  getList(filter: Object): Promise<any> {
    const listuser = User.aggregate([
      { $match: { filter } },
      { $sort: { createdAt: -1 } }
    ])
    return listuser.exec()
  }

  create(data: any): Promise<any> {
    let { name, age, departmentId, role } = data

    role = role * 1 || 0

    if (!this.checkId(departmentId))
      return this.promissErr('DepartmentId invalid')
    const innerArraySchema = {
      type: 'object',
      properties: {
        departmentId: { type: 'string' },
        role: { type: 'integer' }
      }, required: ['departmentId']
    }
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
        department: {
          type: 'array',
          'items': innerArraySchema
        }
      },
      required: ["name", 'age'],
      additionalProperties: false,
    }
    const user = {
      name, age: age * 1, department: [{ departmentId, role }]
    }
    const validate = this.ajv.compile(schema)
    const valid = validate(user)

    if (valid) {
      const newUser = new User(user)
      return newUser.save()
    } else
      throw new Error("Du lieu khong hop le");

  }

  edit(id: string, data: any): Promise<any> {
    if (!this.checkId(id))
      throw new Error("Du lieu khong hop le");
    let { name, age, role } = data

    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        role: { type: 'number' }
      },
      required: ['name', 'age', 'role']
    }

    const validate = this.ajv.compile(schema)
    const valid = validate(data)
    if (!valid)
      throw new Error("Du lieu khong hop le");
    User.findByIdAndUpdate(id, { name, age, role })
    return this.promissSucces('update succes', {})

  }

  async getById(id: string): Promise<any> {
    if (!this.checkId(id))
      throw new Error("Du lieu khong hop le");
    try {
      const user = await User.findById(id)
      return this.promissSucces('Get user succes', user)
    } catch (err) {
      throw new Error("Loi database");
    }
  }

  delete(id: string): Promise<any> {
    if (!this.checkId(id))
      throw new Error("Du lieu khong hop le");

    User.findByIdAndDelete(id)
    return this.promissSucces('Get user succes', {})

  }
}

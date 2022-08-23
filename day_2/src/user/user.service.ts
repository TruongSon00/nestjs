import { Injectable } from '@nestjs/common';
import { userInfo } from 'os';
import { User } from 'src/model/user.model';
import { Types } from 'mongoose';
import Ajv from 'ajv';

@Injectable()
export class UserService {

  ajv = new Ajv()

  promissErr(message: string): Promise<any> {
    return new Promise<any>((reject) => {
      reject(message)
    })
  }

  getHello(): string {
    return 'Hello World!';
  }

  getUsers(filter: Object): Promise<any> {
    const listuser = User.aggregate([
      { $match: { filter } },
      { $sort: { createdAt: -1 } }
    ])
    return listuser.exec()
  }

  create(name: string, age: number, departmentId: Types.ObjectId, role: number): Promise<any> {
    role = role || 0
    console.log(departmentId);
    const innerArraySchema = {
      type: 'object',
      properties: {
        departmentId: { type: 'string' },
        role: { type: 'integer' }
      }, required: ['departmentId']

    }
    const arrayDepartment = {
      type: 'array',
      'items': innerArraySchema

    }
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
        department: arrayDepartment
      },
      required: ["name", 'age'],
      additionalProperties: false,
    }
    const user = {
      name, age, department: [{ departmentId, role }]
    }
    const validate = this.ajv.compile(innerArraySchema)
    const valid = validate(user.department[0])
    console.log(valid)
    console.log({ user: user.department });
    const newUser = new User()
    return this.promissErr('hihi')
  }
}

// User.aggregate([
//   {
//     $lookup: {
//       from: 'department',
//       localField: 'departmentId',
//       foreignField: '_id',
//       as: 'department'
//     },
//     $match: { _id: new Types.ObjectId('hihi') },
//     $group: { _id: 'huhu' }
//   }
// ])
// User.aggregate([
//   {
//     $group: {
//       _id: { _id: "$userId", name: "hihi" },
//       count: { $sum: 1 }
//     }
//   },
//   { $match: { count: { $gt: 1 } }, }])
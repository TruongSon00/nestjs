import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { baseRepositoryAbstract } from 'src/core/base.repository.abstract';
import { userModel } from 'src/model/user.model';
import { validateUserCreate } from 'src/requestValidate/requestUser';
import { IUserRepository } from 'src/components/user/interface/user.interface.repository';

@Injectable()
export class userRepository
  extends baseRepositoryAbstract<userModel>
  implements IUserRepository
{
  constructor(
    @InjectModel('users')
    private userModel: Model<userModel>,
  ) {
    super(userModel);
  }

  async createUser(user: validateUserCreate): Promise<userModel> {
    const { name, age, _id } = user;
    let role = user.role;
    role = role || 0;

    const newUser = new this.userModel();
    newUser.name = name;
    newUser.age = age;
    newUser.department.push({ _id, role });
    return newUser.save();
  }
}

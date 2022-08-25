import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRoleRepository } from 'src/components/role/interface/role.repository.interface';
import { baseRepositoryAbstract } from 'src/core/base.repository.abstract';
import { userModel } from 'src/model/user.model';
@Injectable()
export class roleRepository
  extends baseRepositoryAbstract<userModel>
  implements IRoleRepository
{
  constructor(
    @InjectModel('userModel')
    private readonly userModel: Model<userModel>,
  ) {
    super(userModel);
  }
}

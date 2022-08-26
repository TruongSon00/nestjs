import { baseRepositoryAbstract } from 'src/core/base.repository.abstract';
import { userModel } from 'src/model/user.model';
import { validateUserCreate } from 'src/requestValidate/requestUser';

export interface IUserRepository extends baseRepositoryAbstract<userModel> {
  createUser(user: validateUserCreate): Promise<userModel | any>;
  getUserById(id: any): Promise<userModel[]>;
}

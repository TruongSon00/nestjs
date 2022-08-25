import { baseRepositoryAbstract } from 'src/core/base.repository.abstract';
import { userModel } from 'src/model/user.model';

export interface IRoleRepository extends baseRepositoryAbstract<userModel> {}

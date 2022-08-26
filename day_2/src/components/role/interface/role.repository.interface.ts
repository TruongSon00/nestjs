import { baseRepositoryAbstract } from 'src/core/base.repository.abstract';
import { userModel } from 'src/model/user.model';

export interface IRoleRepository extends baseRepositoryAbstract<userModel> {
  checkDepartment(userId: string, departmentId: string): Promise<userModel>;
  editRoleUser(
    userId: string,
    departmentId: string,
    role: number,
  ): Promise<userModel>;
}

import { baseRepositoryAbstract } from 'src/core/base.repository.abstract';
import { departmentModel } from 'src/model/department.model';
import { userModel } from 'src/model/user.model';
import { validateDepartmentCreate } from 'src/requestValidate/requestDepartment';

export interface IDepartmentRepository
  extends baseRepositoryAbstract<departmentModel> {
  createDepartment(
    data: validateDepartmentCreate,
  ): Promise<departmentModel | any>;
  delDepartment(id: string): Promise<any>;
  getByIdDepartmentAggregate(id: string): Promise<userModel[]>;
}

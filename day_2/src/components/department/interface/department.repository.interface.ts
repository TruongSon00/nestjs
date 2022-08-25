import { baseRepositoryAbstract } from 'src/core/base.repository.abstract';
import { departmentModel } from 'src/model/department.model';
import { validateDepartmentCreate } from 'src/requestValidate/requestDepartment';

export interface IDepartmentRepository
  extends baseRepositoryAbstract<departmentModel> {
  createDepartment(
    data: validateDepartmentCreate,
  ): Promise<departmentModel | any>;
  delDepartment(id: string): Promise<departmentModel | any>;
}

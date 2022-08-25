import { userModel } from 'src/model/user.model';

export interface IDepartmentService<T> {
  createDepartment(data: object): Promise<T | any>;
  editDepartment(data: object): Promise<T | any>;
  delDepartment(id: object): Promise<any>;
  listDepartment(): Promise<T[] | any>;
  getDepartmentById(id: any): Promise<userModel[]>;
}

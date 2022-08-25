export interface IDepartmentService<T> {
  createDepartment(data: object): Promise<T | any>;
  editDepartment(id: any, data: object): Promise<T | any>;
  delDepartment(id: object): Promise<any>;
  listDepartment(data: object): Promise<T[] | any>;
  getDepartmentById(id: any): Promise<T>;
}

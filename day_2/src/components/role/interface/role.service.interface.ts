export interface IRoleService {
  editRoleUser(userId: string, departmentId: string): Promise<any>;
  createRoleUser(
    userId: string,
    departmentId: string,
    role: number,
  ): Promise<any>;
  delRoleUser(userId: string, departmentId: string): Promise<any>;
}

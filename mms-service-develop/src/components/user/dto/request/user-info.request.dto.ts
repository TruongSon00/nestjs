import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

class WarehouseResponse {
  @IsNotEmpty()
  id: number;
}

class UserRoleSettingResponse {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;
}

class FactoryResponse {
  @IsNotEmpty()
  id: number;
}

class DepartmentSettingResponse {
  @IsNotEmpty()
  id: number;
}
export class UserInforRequestDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  companyId: number;

  @IsNotEmpty()
  dateOfBirth: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  status: number;

  @IsNotEmpty()
  createdAt: string;

  @IsNotEmpty()
  updatedAt: string;

  @IsNotEmpty()
  @Type(() => WarehouseResponse)
  userWarehouses: WarehouseResponse[];

  @IsNotEmpty()
  @Type(() => UserRoleSettingResponse)
  userRoleSettings: UserRoleSettingResponse[];

  @IsNotEmpty()
  @Type(() => DepartmentSettingResponse)
  departmentSettings: DepartmentSettingResponse[];

  @IsNotEmpty()
  @Type(() => FactoryResponse)
  factories: FactoryResponse[];
}

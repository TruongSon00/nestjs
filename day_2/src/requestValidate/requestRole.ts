import { Min, IsInt, IsNotEmpty, IsMongoId, Max } from 'class-validator';

export class validateRoleEdit {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  departmentId: string;

  @IsInt()
  @Min(0)
  @Max(3)
  @IsNotEmpty()
  role: number;
}

export class validateRoleDel {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  departmentId: string;
}

export class validateRoleAdd {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  departmentId: string;

  @IsInt()
  @Min(0)
  @Max(3)
  @IsNotEmpty()
  role: number;
}

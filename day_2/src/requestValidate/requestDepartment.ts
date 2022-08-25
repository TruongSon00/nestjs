import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class validateDepartmentCreate {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  descript: string;
}

export class validateDepartmentEdit {
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  descript: string;
}

export class validateDepartmentFindId {
  id: string;
}

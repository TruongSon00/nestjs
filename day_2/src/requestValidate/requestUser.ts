import {
  IsString,
  Min,
  IsInt,
  IsNotEmpty,
  IsMongoId,
  Max,
  IsEmpty,
} from 'class-validator';
import { ObjectId, Types } from 'mongoose';

export class validateUserCreate {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(10)
  @Max(100)
  @IsNotEmpty()
  age: number;

  @IsNotEmpty()
  @IsMongoId()
  departmentId: Types.ObjectId;

  @IsNotEmpty()
  @Min(0)
  @Max(3)
  role: number;
}

export class validateUserEdit {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(10)
  @Max(100)
  @IsNotEmpty()
  age: number;
}

export class validateUserFindId {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}

import { BaseDto } from '@core/dto/base.dto';
import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';

export class DeviceAssignment {
  @IsMongoId()
  @IsNotEmpty()
  deviceRequestId: string;

  @IsString()
  @MaxLength(15)
  @Transform((value) => value.value.toString())
  @Matches(/^[\w.-]+$/)
  @IsNotEmpty()
  serial: string;

  @IsNotEmpty()
  @IsDateString()
  assignedAt: Date;

  @IsNotEmpty()
  @IsDateString()
  usedAt: Date;

  @IsNumber()
  @IsOptional()
  oee: Number;

  @IsString()
  @IsNotEmpty()
  responsibleUserId: string;
}

export class ImportDeviceAssignRequestDto extends BaseDto {
  @IsArray()
  @ValidateNested()
  @Type(() => DeviceAssignment)
  items: DeviceAssignment[];

  @IsNotEmpty()
  user: UserInforRequestDto;
}

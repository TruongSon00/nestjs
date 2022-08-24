import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { DEVICE_GROUP_CONST } from '@components/device-group/device-group.constant';
import { IsSqlId } from 'src/validator/is-sql-id.validator';
import { IsSqlOrNoSqlId } from 'src/validator/is-nosql-or-sql-id.validator';
import { ResponsibleSubjectType } from '@components/device/device.constant';
export class ResponsibleUser {
  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsSqlOrNoSqlId()
  id: string | number;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsEnum(ResponsibleSubjectType)
  type: ResponsibleSubjectType;
}
export class CreateDeviceGroupRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @MaxLength(DEVICE_GROUP_CONST.CODE.MAX_LENGTH)
  @IsString()
  @Matches(DEVICE_GROUP_CONST.CODE.REGEX)
  code: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @MaxLength(DEVICE_GROUP_CONST.NAME.MAX_LENGTH)
  @IsString()
  @Matches(DEVICE_GROUP_CONST.NAME.REGEX)
  name: string;

  @ApiProperty()
  @Expose()
  @ValidateNested()
  @Type(() => ResponsibleUser)
  responsibleUser: ResponsibleUser;

  @ApiProperty()
  @Expose()
  @MaxLength(DEVICE_GROUP_CONST.DESCRIPTION.MAX_LENGTH)
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  @IsSqlId()
  userId: number;
}

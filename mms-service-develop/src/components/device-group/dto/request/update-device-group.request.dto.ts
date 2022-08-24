import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
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
import { DEVICE_GROUP_CONST } from '@components/device-group/device-group.constant';
import { BaseDto } from '@core/dto/base.dto';
import { IsSqlId } from 'src/validator/is-sql-id.validator';
import { IsNoSqlId } from 'src/validator/is-nosql-id.validator';
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

export class UpdateDeviceGroupRequestBody extends BaseDto {
  @ApiProperty({ example: 'ABC123', description: 'Tên của nom thiết bị' })
  @Expose()
  @IsNotEmpty()
  @MaxLength(DEVICE_GROUP_CONST.NAME.MAX_LENGTH)
  @Matches(DEVICE_GROUP_CONST.NAME.REGEX)
  name: string;

  @ApiProperty()
  @Expose()
  @ValidateNested()
  @Type(() => ResponsibleUser)
  responsibleUser: ResponsibleUser;

  @ApiProperty({ example: 'Mô tả', description: 'Mô tả' })
  @Expose()
  @MaxLength(DEVICE_GROUP_CONST.DESCRIPTION.MAX_LENGTH)
  description: string;

  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  @IsSqlId()
  userId: number;
}
export class UpdateDeviceGroupRequestDto extends UpdateDeviceGroupRequestBody {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsNoSqlId()
  _id: string;
}

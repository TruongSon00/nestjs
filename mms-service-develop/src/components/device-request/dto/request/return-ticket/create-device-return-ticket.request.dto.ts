import { Expose } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { DEVICE_REQUEST_CONST } from '@components/device-request/device-request.constant';
import { BaseDto } from '@core/dto/base.dto';
import { IsSqlId } from '../../../../../validator/is-sql-id.validator';
import { IsNoSqlIdArray } from '../../../../../validator/is-nosql-id-array.validator';

export class CreateDeviceReturnTicketRequestDto extends BaseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(DEVICE_REQUEST_CONST.NAME.MAX_LENGTH)
  @Matches(DEVICE_REQUEST_CONST.NAME.REGEX)
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(DEVICE_REQUEST_CONST.DESCRIPTION.MAX_LENGTH)
  description: string;

  @Expose()
  @IsNoSqlIdArray()
  @ArrayNotEmpty()
  deviceAssignmentIds: string[];

  @Expose()
  @IsNotEmpty()
  @IsSqlId()
  userId: number;
}

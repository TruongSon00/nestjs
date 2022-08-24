import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { DEVICE_REQUEST_CONST } from '@components/device-request/device-request.constant';
import { BaseDto } from '@core/dto/base.dto';
import { IsNoSqlId } from '../../../../../validator/is-nosql-id.validator';
import { IsSqlId } from '../../../../../validator/is-sql-id.validator';
export class CreateDeviceRequestTicketBody extends BaseDto {
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
  @IsNotEmpty()
  @IsSqlId()
  uId: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @Min(0)
  quantity: number;

  @Expose()
  @IsOptional()
  @IsSqlId()
  workCenterId: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  deviceId: string;
}
export class CreateDeviceRequestTicketRequestDto extends CreateDeviceRequestTicketBody {
  @Expose()
  @IsNotEmpty()
  @IsSqlId()
  userCreatorId: number;
}

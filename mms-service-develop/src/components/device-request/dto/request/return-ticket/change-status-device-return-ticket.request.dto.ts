import { BaseDto } from '@core/dto/base.dto';
import { Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { IsNoSqlId } from '../../../../../validator/is-nosql-id.validator';
import { DeviceReturnTicketStatus } from '../../../../../models/device-return-ticket/device-return-ticket.schema';

export class ChangeStatusDeviceReturnTicketRequestDto extends BaseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  id: string;

  @Type(() => Number)
  @Expose()
  @IsNotEmpty()
  @IsEnum(DeviceReturnTicketStatus)
  status: DeviceReturnTicketStatus;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  userId: number;
}

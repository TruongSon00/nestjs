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
import { DeviceRequestTicketStatus } from '../../../../../models/device-request-ticket/device-request-ticket.schema';

export class ChangeStatusDeviceRequestTicketRequestDto extends BaseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  id: string;

  @Type(() => Number)
  @Expose()
  @IsNotEmpty()
  @IsEnum(DeviceRequestTicketStatus)
  status: DeviceRequestTicketStatus;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  userId: number;

  @Expose()
  @IsNotEmpty()
  user: any;
}

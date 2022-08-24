import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { IsNoSqlId } from '../../../../../validator/is-nosql-id.validator';

export class DeleteDeviceReturnTicketRequestDto extends BaseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  id: string;
}

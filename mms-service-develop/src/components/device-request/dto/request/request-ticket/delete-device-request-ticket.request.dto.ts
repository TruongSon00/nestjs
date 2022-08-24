import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsNoSqlId } from '../../../../../validator/is-nosql-id.validator';
import { BaseDto } from '@core/dto/base.dto';

export class DeleteDeviceRequestTicketRequestDto extends BaseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  id: string;
}

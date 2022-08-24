import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { IsNoSqlId } from '../../../../../validator/is-nosql-id.validator';

export class DetailDeviceReturnRequestDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  id: string;
}

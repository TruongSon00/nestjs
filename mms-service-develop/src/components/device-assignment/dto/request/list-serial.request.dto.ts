import { BaseDto } from '@core/dto/base.dto';
import { IsOptional, IsString } from 'class-validator';

export class ListSerialRequest extends BaseDto {
  @IsOptional()
  @IsString()
  serial: string;
}

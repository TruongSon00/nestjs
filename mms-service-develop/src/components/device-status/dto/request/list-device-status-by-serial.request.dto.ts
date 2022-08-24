import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationQuery } from '@utils/pagination.query';

export class ListDeviceStatusBySerialQuery extends PaginationQuery {
  @IsDateString()
  @IsOptional()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  endDate: Date;
}
export class ListDeviceStatusBySerialRequestDto extends ListDeviceStatusBySerialQuery {
  @IsString()
  @IsNotEmpty()
  serial: string;
}

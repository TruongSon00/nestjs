import { BaseDto } from '@core/dto/base.dto';
import { PaginationQuery } from '@utils/pagination.query';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ListJobByDeviceRequestDto extends PaginationQuery {
  @IsInt()
  @IsOptional()
  userId: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  serial: string;
}

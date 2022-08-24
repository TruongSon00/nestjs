import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQuery, Sort, Filter } from '@utils/pagination.query';
import { DeviceRequestType } from '@components/device-request/device-request.constant';

export class ListDeviceRequestsRequestDto extends PaginationQuery {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsArray()
  @Type(() => Filter)
  filter?: Filter[];

  @Type(() => Sort)
  @IsArray()
  @IsOptional()
  sort?: Sort[];

  @IsOptional()
  @Type(() => Number)
  @IsEnum(DeviceRequestType)
  type: number;

  @IsOptional()
  isGetAll: boolean;
}

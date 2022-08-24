import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { MAINTENANCE_ATTRIBUTE_CONST } from '@components/maintenance-attribute/maintenance-attribute.constant';
import { IsSqlId } from '../../../../validator/is-sql-id.validator';

export class CreateMaintenanceAttributeRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(MAINTENANCE_ATTRIBUTE_CONST.CODE.MAX_LENGTH)
  @Matches(MAINTENANCE_ATTRIBUTE_CONST.CODE.REGEX)
  code: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(MAINTENANCE_ATTRIBUTE_CONST.NAME.MAX_LENGTH)
  @Matches(MAINTENANCE_ATTRIBUTE_CONST.NAME.REGEX)
  name: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @MaxLength(MAINTENANCE_ATTRIBUTE_CONST.DESCRIPTION.MAX_LENGTH)
  @IsOptional()
  description: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  @IsSqlId()
  userId: number;
}

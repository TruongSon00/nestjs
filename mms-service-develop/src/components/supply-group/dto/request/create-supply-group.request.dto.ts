import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { SUPPLY_GROUP_CONST } from '@components/supply-group/supply-group.constant';

export class CreateSupplyGroupRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @MaxLength(SUPPLY_GROUP_CONST.CODE.MAX_LENGTH)
  @IsString()
  @Matches(SUPPLY_GROUP_CONST.CODE.REGEX)
  code: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @MaxLength(SUPPLY_GROUP_CONST.NAME.MAX_LENGTH)
  @IsString()
  @Matches(SUPPLY_GROUP_CONST.NAME.REGEX)
  name: string;

  @ApiProperty()
  @Expose()
  @MaxLength(SUPPLY_GROUP_CONST.DESCRIPTION.MAX_LENGTH)
  @IsOptional()
  @IsString()
  description: string;
}

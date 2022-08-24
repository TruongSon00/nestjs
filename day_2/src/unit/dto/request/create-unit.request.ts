import { UNIT_CONST } from '@components/unit/unit.constant';
import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateUnitRequest extends BaseDto {
  @ApiProperty({ example: 'ABC123', description: 'Code của đơn vị' })
  @MaxLength(UNIT_CONST.CODE.MAX_LENGTH)
  @Matches(UNIT_CONST.CODE.REGEX)
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'ABC123', description: 'Tên của đơn vị' })
  @MaxLength(UNIT_CONST.NAME.MAX_LENGTH)
  @Matches(UNIT_CONST.NAME.REGEX)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ABC123', description: 'Mô tả của đơn vị' })
  @MaxLength(UNIT_CONST.DESCRIPTION.MAX_LENGTH)
  @IsString()
  @IsOptional()
  description: string;
}

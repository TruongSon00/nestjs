import { BaseDto } from '@core/dto/base.dto';
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
import { DEFECT_CONST } from '@components/defect/defect.constant';
import { IsNoSqlId } from 'src/validator/is-nosql-id.validator';
import { IsSqlId } from 'src/validator/is-sql-id.validator';

export class CreateDefectRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(DEFECT_CONST.CODE.MAX_LENGTH)
  @Matches(DEFECT_CONST.CODE.REGEX)
  code: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(DEFECT_CONST.NAME.MAX_LENGTH)
  @Matches(DEFECT_CONST.NAME.REGEX)
  name: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @MaxLength(DEFECT_CONST.DESCRIPTION.MAX_LENGTH)
  @IsOptional()
  description: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  priority: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsNoSqlId()
  deviceId: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  @IsSqlId()
  userId: number;
}

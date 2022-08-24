import { BaseDto } from '@core/dto/base.dto';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNoSqlId } from 'src/validator/is-nosql-id.validator';

export class ConfirmDeviceGroupRequestDto extends BaseDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  _id: string;
}

export class ConfirmDeviceGroupParamDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  id: string;
}

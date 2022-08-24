import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
export class RejectWarningBodyDto extends BaseDto {
  @ApiProperty({ example: 'reason' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason: string;
}
export class RejectWarningRequestDto extends RejectWarningBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ValidateSerialRequest extends BaseDto {
  @ApiProperty({
    description: 'Mã serial',
    type: String,
  })
  @IsNotEmpty()
  serial: string;
}

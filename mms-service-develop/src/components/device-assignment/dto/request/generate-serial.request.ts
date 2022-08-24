import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GenerateSerialRequest extends BaseDto {
  @ApiProperty({
    description: 'Mã thiết bị',
    type: String,
  })
  @IsNotEmpty()
  deviceCode: string;
}

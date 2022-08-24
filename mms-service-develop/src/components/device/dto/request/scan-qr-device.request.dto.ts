import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@core/dto/base.dto';

export class ScanQrDeviceRequestDto extends BaseDto {
  @ApiProperty({
    description: 'QR Code',
  })
  @IsString()
  @IsNotEmpty()
  qrCode: string;
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;
}

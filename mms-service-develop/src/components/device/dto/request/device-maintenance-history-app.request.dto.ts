import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';

export class DeviceMaintenanceHistoryAppRequestDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serial: string;
}

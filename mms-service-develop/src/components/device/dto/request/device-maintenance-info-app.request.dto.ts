import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';

export class DeviceMaintenanceInfoAppRequestDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serial: string;
}

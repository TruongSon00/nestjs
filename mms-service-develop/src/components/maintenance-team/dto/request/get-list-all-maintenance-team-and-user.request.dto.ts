import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { BaseDto } from '@core/dto/base.dto';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetListAllMaintenanceTeamAndUserRequestDto extends BaseDto {
  @IsNotEmpty()
  user: UserInforRequestDto;

  @IsNumber()
  @Transform((v) => Number(v.value))
  @IsOptional()
  isGetAll: number;
}

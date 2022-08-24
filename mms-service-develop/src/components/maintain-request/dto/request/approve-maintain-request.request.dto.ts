import { BaseDto } from '@core/dto/base.dto';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ConfirmDeviceGroupRequestDto } from '@components/device-group/dto/request/confirm-device-group.request.dto';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { STATUS_TO_APPROVE_MAINTAIN_REQUEST } from '@components/maintain-request/maintain-request.constant';
import { ApiError } from '@utils/api.error';
import { DeviceGroupStatusConstant } from '@components/device-group/device-group.constant';
import { HistoryActionEnum } from '@components/history/history.constant';

export class ApproveMaintainRequestDto extends BaseDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  id: string;
}

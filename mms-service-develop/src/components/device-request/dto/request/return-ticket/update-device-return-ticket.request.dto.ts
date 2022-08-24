import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsNoSqlId } from '../../../../../validator/is-nosql-id.validator';
import { CreateDeviceReturnTicketRequestDto } from '@components/device-request/dto/request/return-ticket/create-device-return-ticket.request.dto';

export class UpdateDeviceReturnTicketRequestDto extends CreateDeviceReturnTicketRequestDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  id: string;
}

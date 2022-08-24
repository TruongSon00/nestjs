import {
  CreateDeviceRequestTicketBody,
  CreateDeviceRequestTicketRequestDto,
} from '@components/device-request/dto/request/request-ticket/create-device-request-ticket.request.dto';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsNoSqlId } from '../../../../../validator/is-nosql-id.validator';
export class UpdateDeviceRequestTicketBody extends CreateDeviceRequestTicketBody {}
export class UpdateDeviceRequestTicketRequestDto extends CreateDeviceRequestTicketRequestDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  id: string;
}

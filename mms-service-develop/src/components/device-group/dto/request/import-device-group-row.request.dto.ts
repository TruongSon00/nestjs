import { ImportBaseDto } from '@components/import/dto/request/import.base.dto';
import { Expose } from 'class-transformer';

export class ImportDeviceGroupRowRequestDto extends ImportBaseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  responsibleUser: string;

  @Expose()
  description: string;
}

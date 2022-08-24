import { Expose } from 'class-transformer';
import { ImportResultBaseDto } from '@components/import/dto/response/import-result.base.dto';

export class ImportDeviceGroupResultDto extends ImportResultBaseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  responsibleUser: string;

  @Expose()
  description: string;
}

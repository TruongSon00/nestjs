import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from '@utils/success.response.dto';
import { Expose, Type } from 'class-transformer';

class ValidateSerial {
  @ApiProperty({
    type: Boolean,
  })
  @Expose()
  status: boolean;
}

export class ValidateSerialResponse extends SuccessResponse {
  @ApiProperty({ type: ValidateSerial })
  @Expose()
  @Type(() => ValidateSerial)
  data: ValidateSerial;
}

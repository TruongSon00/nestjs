import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateCodeRequest extends BaseDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

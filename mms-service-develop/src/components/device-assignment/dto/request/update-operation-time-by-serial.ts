import { BaseDto } from '@core/dto/base.dto';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class UpdateOperationTimeBySerial extends BaseDto {
  @IsString()
  @IsNotEmpty()
  serial: string;

  @IsInt()
  @IsNotEmpty()
  workOrderId: number;

  @IsInt()
  @IsNotEmpty()
  shiftId: number;

  @IsDateString()
  @IsNotEmpty()
  operationDate: Date;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  actualOperationTime: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  actualBreakTime: number;
}

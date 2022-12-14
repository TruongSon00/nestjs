import { BaseDto } from '@core/dto/base.dto';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
class Item {
  @IsString()
  @MaxLength(15)
  @Transform((value) => value.value.toString())
  @Matches(/^[\w.-]+$/)
  @IsNotEmpty()
  serial: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: string[];
}
export class GenerateQrCodeSerialRequest extends BaseDto {
  @ArrayUnique<Item>((e: Item) => e.serial)
  @Type(() => Item)
  @ArrayNotEmpty()
  serials: Item[];
}

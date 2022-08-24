import { BaseDto } from '@core/dto/base.dto';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

class UpdateActualQuantity {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/)
  code: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}
export class UpdateActualQuantityRequest extends BaseDto {
  @Type(() => UpdateActualQuantity)
  @ValidateNested({ each: true })
  @ArrayUnique<UpdateActualQuantity>((e) => e.code)
  @ArrayNotEmpty()
  items: UpdateActualQuantity[];

  @IsMongoId()
  @IsNotEmpty()
  requestId: string;
}

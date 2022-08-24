import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';

export class ItemPORequest {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;
}

export class CreatePurchasedOrderDto {
  @IsOptional()
  @IsInt()
  createdByUserId: number;

  @IsOptional()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  name: string;

  @IsNumber()
  @IsOptional()
  type: number;

  @IsNumber()
  @IsOptional()
  companyId: number;

  @IsNumber()
  @IsOptional()
  vendorId: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 24)
  code: string;

  @IsNotEmpty()
  @IsDateString()
  deadline: Date;

  @Type(() => ItemPORequest)
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  items: ItemPORequest[];

  @IsNotEmpty()
  @IsDateString()
  purchasedAt: Date;
}

import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class CardDetailsDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  cvc: string;

  @IsString()
  @IsNotEmpty()
  exp_month: string;

  @IsString()
  @IsNotEmpty()
  exp_year: string;

  @IsString()
  @IsNotEmpty()
  card_holder: string;
}

class ProductToBuyDto {
  @IsNumber()
  idProduct: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}

export class PaymentRequestDto {
  @ValidateNested()
  @Type(() => CardDetailsDto)
  card: CardDetailsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductToBuyDto)
  products: ProductToBuyDto[];
}

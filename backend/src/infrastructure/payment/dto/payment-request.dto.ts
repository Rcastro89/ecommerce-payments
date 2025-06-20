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

  @IsString()
  @IsNotEmpty()
  installments: string;
}

class ProductToBuyDto {
  @IsNumber()
  idProduct: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}

class CustomerDto {
  @IsString()
  idClient: string;

  @IsString()
  fullName: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;
}

export class PaymentRequestDto {
  @ValidateNested()
  @Type(() => CardDetailsDto)
  card: CardDetailsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductToBuyDto)
  products: ProductToBuyDto[];

  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;
}

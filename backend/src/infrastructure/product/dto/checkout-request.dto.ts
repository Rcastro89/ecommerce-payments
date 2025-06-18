// src/infrastructure/product/dto/checkout-request.dto.ts
import { ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CheckoutItemDto } from './checkout-item.dto';

export class CheckoutRequestDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  products: CheckoutItemDto[];
}

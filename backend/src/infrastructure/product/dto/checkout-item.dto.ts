// src/infrastructure/product/dto/checkout-item.dto.ts
import { IsInt, IsPositive, Min } from 'class-validator';

export class CheckoutItemDto {
  @IsInt()
  @IsPositive()
  idProduct: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

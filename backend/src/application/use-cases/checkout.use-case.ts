// src/application/use-cases/checkout.use-case.ts
import { Injectable } from '@nestjs/common';
import { InMemoryProductRepository } from '../../infrastructure/product/repositories/in-memory-product.repository';
import { CheckoutError } from '../../domain/errors/checkout-error';

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

interface CheckoutItem {
  idProduct: number;
  quantity: number;
}

@Injectable()
export class CheckoutUseCase {
  constructor(private readonly productRepo: InMemoryProductRepository) {}

  async execute(items: CheckoutItem[]): Promise<Result<string, CheckoutError[]>> {
    const errors: CheckoutError[] = [];

    for (const { idProduct, quantity } of items) {
      const product = await this.productRepo.findById(idProduct);
      if (!product) {
        errors.push({ type: 'PRODUCT_NOT_FOUND', id: idProduct });
        continue;
      }
      if (product.stock < quantity) {
        errors.push({ type: 'OUT_OF_STOCK', id: idProduct });
      }
    }

    if (errors.length > 0) {
      return { ok: false, error: errors };
    }

    for (const { idProduct, quantity } of items) {
      await this.productRepo.decreaseStock(idProduct, quantity);
    }

    return { ok: true, value: 'Checkout completed successfully' };
  }
}

// src/application/use-cases/checkout.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/domain/product/product.repository';

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

interface CheckoutItem {
  idProduct: number;
  quantity: number;
}

@Injectable()
export class CheckoutUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepo: ProductRepository,
  ) {}

  async execute() {
    return await this.productRepo.findAll();
  }
}

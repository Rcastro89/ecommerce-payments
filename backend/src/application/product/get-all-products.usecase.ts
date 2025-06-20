import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/product/product.entity';
import { ProductRepository } from '../../domain/product/product.repository';

@Injectable()
export class GetAllProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}

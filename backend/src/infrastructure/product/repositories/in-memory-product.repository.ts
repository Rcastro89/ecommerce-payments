import { Injectable } from '@nestjs/common';
import { Product } from '../../../domain/product/product.entity';
import { ProductRepository } from '../../../domain/product/product.repository';
import { productsMock } from '../data/products.mock';

@Injectable()
export class InMemoryProductRepository implements ProductRepository {
  async findAll(): Promise<Product[]> {
    return productsMock;
  }
}

import { Injectable } from '@nestjs/common';
import { Product } from '../../../domain/product/product.entity';
import { ProductRepository } from '../../../domain/product/product.repository';
import { productsMock } from '../data/products.mock';

@Injectable()
export class InMemoryProductRepository implements ProductRepository {
  private readonly products: Product[] = productsMock;

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findById(id: number): Promise<Product | undefined> {
    return this.products.find(p => p.idProduct === id);
  }

  async decreaseStock(id: number, quantity: number): Promise<void> {
    const product = await this.findById(id);
    if (product && product.stock >= quantity) {
      product.stock -= quantity;
    }
  }
}

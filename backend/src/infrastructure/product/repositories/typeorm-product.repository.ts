import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/domain/product/product.entity';
import { ProductRepository } from 'src/domain/product/product.repository';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) { }

  async findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Product | null> {
    return this.repository.findOneBy({ idProduct: id });
  }

  async save(product: Product): Promise<Product> {
    return this.repository.save(product);
  }

  async updateStock(id: number, newStock: number): Promise<void> {
    await this.repository.update(id, { stock: newStock });
  }

  async preloadData(products: Product[]): Promise<void> {
    await this.repository.save(products);
  }

  async updateMultipleStock(updates: { id: number, quantity: number }[]): Promise<void> {
  for (const { id, quantity } of updates) {
    await this.repository.decrement({ idProduct: id }, 'stock', quantity);
  }
}
}

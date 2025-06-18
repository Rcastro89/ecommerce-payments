import { Controller, Get } from '@nestjs/common';
import { GetAllProductsUseCase } from '../../../application/product/get-all-products.usecase';
import { InMemoryProductRepository } from '../repositories/in-memory-product.repository';
import { Product } from '../../../domain/product/product.entity';

@Controller('products')
export class ProductController {
  private readonly getAllProductsUseCase: GetAllProductsUseCase;

  constructor(private readonly productRepository: InMemoryProductRepository) {
    this.getAllProductsUseCase = new GetAllProductsUseCase(this.productRepository);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.getAllProductsUseCase.execute();
  }
}

import { Controller, Get, } from '@nestjs/common';
import { GetAllProductsUseCase } from '../../../application/product/get-all-products.usecase';
import { Product } from '../../../domain/product/product.entity';
import { ProductRepository } from 'src/domain/product/product.repository';

@Controller('products')
export class ProductController {
  private readonly getAllProductsUseCase: GetAllProductsUseCase;

  constructor(private readonly productRepository: ProductRepository) {
    this.getAllProductsUseCase = new GetAllProductsUseCase(this.productRepository);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.getAllProductsUseCase.execute();
  }
}

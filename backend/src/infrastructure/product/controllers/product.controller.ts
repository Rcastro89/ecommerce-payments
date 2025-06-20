import { Controller, Get, } from '@nestjs/common';
import { GetAllProductsUseCase } from '../../../application/product/get-all-products.usecase';
import { Product } from '../../../domain/product/product.entity';
import { ProductRepository } from '../../../domain/product/product.repository';

@Controller('products')
export class ProductController {

  constructor(private readonly productRepository: ProductRepository, 
              private readonly getAllProductsUseCase: GetAllProductsUseCase) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return this.getAllProductsUseCase.execute();
  }
}

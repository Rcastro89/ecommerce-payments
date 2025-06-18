import { Module } from '@nestjs/common';
import { ProductController } from './infrastructure/product/controllers/product.controller';
import { InMemoryProductRepository } from './infrastructure/product/repositories/in-memory-product.repository';
import { ConfigModule } from '@nestjs/config';
import { CheckoutUseCase } from './application/use-cases/checkout.use-case';
import { CheckoutController } from './infrastructure/product/controllers/checkout.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [ProductController, CheckoutController],
  providers: [InMemoryProductRepository, CheckoutUseCase],
})
export class AppModule {}

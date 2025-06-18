import { Module } from '@nestjs/common';
import { ProductController } from './infrastructure/product/controllers/product.controller';
import { InMemoryProductRepository } from './infrastructure/product/repositories/in-memory-product.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [ProductController],
  providers: [InMemoryProductRepository],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './infrastructure/product/controllers/product.controller';
import { CheckoutController } from './infrastructure/product/controllers/checkout.controller';
import { PaymentController } from './infrastructure/payment/controllers/payment.controller';

import { CheckoutUseCase } from './application/use-cases/checkout.use-case';
import { PaymentUseCase } from './application/use-cases/payment.use-case';

import { WompiService } from './infrastructure/wompi/wompi.service';
import { Product } from './domain/product/product.entity';
import { TypeOrmProductRepository } from './infrastructure/product/repositories/typeorm-product.repository';
import { GetAllProductsUseCase } from './application/product/get-all-products.usecase';
import { ProductRepository } from './domain/product/product.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: [Product],
      synchronize: true, // ⚠️ solo para desarrollo
    }),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [
    ProductController,
    CheckoutController,
    PaymentController,
  ],
  providers: [
    CheckoutUseCase,
    PaymentUseCase,
    TypeOrmProductRepository,
    GetAllProductsUseCase,
    {
      provide: 'IWompiService',
      useClass: WompiService,
    },
    {
      provide: ProductRepository,
      useExisting: TypeOrmProductRepository,
    }
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProductController } from './infrastructure/product/controllers/product.controller';
import { CheckoutController } from './infrastructure/product/controllers/checkout.controller';
import { PaymentController } from './infrastructure/payment/controllers/payment.controller';

import { InMemoryProductRepository } from './infrastructure/product/repositories/in-memory-product.repository';
import { CheckoutUseCase } from './application/use-cases/checkout.use-case';
import { PaymentUseCase } from './application/use-cases/payment.use-case';

import { WompiService } from './infrastructure/wompi/wompi.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [
    ProductController,
    CheckoutController,
    PaymentController,
  ],
  providers: [
    InMemoryProductRepository,
    CheckoutUseCase,
    PaymentUseCase,
    {
      provide: 'IWompiService',
      useClass: WompiService,
    },
  ],
})
export class AppModule {}

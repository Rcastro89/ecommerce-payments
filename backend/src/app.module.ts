import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './infrastructure/product/controllers/product.controller';
import { PaymentController } from './infrastructure/payment/controllers/payment.controller';

import { PaymentUseCase } from './application/use-cases/payment.use-case';

import { WompiService } from './infrastructure/wompi/wompi.service';
import { Product } from './domain/product/product.entity';
import { TypeOrmProductRepository } from './infrastructure/product/repositories/typeorm-product.repository';
import { GetAllProductsUseCase } from './application/product/get-all-products.usecase';
import { ProductRepository } from './domain/product/product.repository';
import { Client } from './domain/client/client.entity';
import { Transaction } from './domain/transaction/transaction.entity';
import { TransactionItem } from './domain/transaction/transaction-item.entity';
import { Delivery } from './domain/delivery/delivery.entity';
import { TypeOrmClientRepository } from './infrastructure/client/repositories/typeorm-client.repository';
import { TypeOrmDeliveryRepository } from './infrastructure/delivery/repositories/typeorm-delivery.repository';
import { TypeOrmTransactionItemRepository } from './infrastructure/transaction/repositories/typeorm-transaction-item.repository';
import { TypeOrmTransactionRepository } from './infrastructure/transaction/repositories/typeorm-transaction.repository';
import { ClientRepository } from './domain/client/client.repository';
import { TransactionRepository } from './domain/transaction/transaction.repository';
import { TransactionItemRepository } from './domain/transaction/transaction-item.repository';
import { DeliveryRepository } from './domain/delivery/delivery.repository';

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
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Product,
      Client,
      Transaction,
      TransactionItem,
      Delivery,
    ]),
  ],
  controllers: [
    ProductController,
    PaymentController,
  ],
  providers: [
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
    },
    {
      provide: ClientRepository,
      useClass: TypeOrmClientRepository,
    },
    {
      provide: TransactionRepository,
      useClass: TypeOrmTransactionRepository,
    },
    {
      provide: TransactionItemRepository,
      useClass: TypeOrmTransactionItemRepository,
    },
    {
      provide: DeliveryRepository,
      useClass: TypeOrmDeliveryRepository,
    },
  ],
})
export class AppModule { }

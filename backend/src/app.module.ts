import { Module, OnModuleInit } from '@nestjs/common';
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
export class AppModule implements OnModuleInit {
  constructor(private readonly dataSource: ProductRepository) { }

  async onModuleInit() {
    const productRepository = await this.dataSource.findAll();
    const count = productRepository.length;

    if (count === 0) {
      const mockProducts: Partial<Product>[] = [
        {
          name: 'Kit de Escritorio Premium',
          description: 'Conjunto de escritorio con estilo moderno: teclado, libreta, gafas y más.',
          price: 259900,
          stock: 38,
          imageUrl: 'https://plus.unsplash.com/premium_photo-1664297844174-d7dfb8d0e7f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Portátil HP ProBook 450',
          description: 'Laptop profesional con gran rendimiento para trabajo diario.',
          price: 2899000,
          stock: 15,
          imageUrl: 'https://images.unsplash.com/photo-1585076641399-5c06d1b3365f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Tablet Android 10.5"',
          description: 'Pantalla amplia, gran fluidez y batería duradera para todo uso.',
          price: 1299000,
          stock: 22,
          imageUrl: 'https://images.unsplash.com/photo-1662116137257-6e5793c365ec?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Soporte Universal para Celular',
          description: 'Ideal para videollamadas o visualización cómoda de contenido.',
          price: 49900,
          stock: 57,
          imageUrl: 'https://images.unsplash.com/photo-1603969072881-b0fc7f3d77d7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'MacBook Pro Retina',
          description: 'Rendimiento y elegancia con la pantalla Retina más avanzada.',
          price: 6799000,
          stock: 7,
          imageUrl: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Kit Tecnológico 3 en 1',
          description: 'Tecnología portátil: adaptador, audífonos y memoria USB.',
          price: 89900,
          stock: 33,
          imageUrl: 'https://images.unsplash.com/photo-1656680715953-75d4bbcbb839?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Mini Laptop Portátil 11"',
          description: 'Diseño compacto con alto rendimiento, ideal para estudiantes.',
          price: 1599000,
          stock: 12,
          imageUrl: 'https://plus.unsplash.com/premium_photo-1678565869434-c81195861939?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Smartphone Android X1',
          description: 'Potente y elegante con cámara de alta resolución.',
          price: 1120000,
          stock: 29,
          imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Smartphone Galaxy Neo',
          description: 'Pantalla nítida, gran rendimiento y batería de larga duración.',
          price: 1390000,
          stock: 24,
          imageUrl: 'https://images.unsplash.com/photo-1529653762956-b0a27278529c?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Smartphone Quantum Z',
          description: 'Triple cámara, alto rendimiento y pantalla inmersiva.',
          price: 1899000,
          stock: 17,
          imageUrl: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=1181&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Teclado Inalámbrico Slim',
          description: 'Diseño moderno, compacto y silencioso para trabajar cómodo.',
          price: 119900,
          stock: 42,
          imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Teclado Mecánico RGB',
          description: 'Ideal para gamers: respuesta rápida, retroiluminación y durabilidad.',
          price: 189000,
          stock: 35,
          imageUrl: 'https://images.unsplash.com/photo-1627827964356-a9c2f262fd64?q=80&w=1145&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Combo Teclado + Mouse',
          description: 'Conjunto ergonómico para oficina o estudio, conexión inalámbrica.',
          price: 159900,
          stock: 28,
          imageUrl: 'http://images.unsplash.com/photo-1718372146650-798b9fb23573?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Mouse Óptico HP',
          description: 'Diseño ergonómico, alta precisión y conexión USB.',
          price: 49900,
          stock: 60,
          imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Mouse Inalámbrico Logitech',
          description: 'Conexión por USB, cómodo para uso diario.',
          price: 69900,
          stock: 48,
          imageUrl: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Mouse Gamer RGB',
          description: 'Diseñado para precisión extrema en juegos, retroiluminado.',
          price: 129900,
          stock: 20,
          imageUrl: 'https://plus.unsplash.com/premium_photo-1671611822374-4719df5c89bb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Mouse Negro Clásico USB',
          description: 'Sencillo, resistente y compatible con cualquier equipo.',
          price: 29900,
          stock: 90,
          imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Memoria USB 64GB',
          description: 'Rápida y compacta, ideal para llevar archivos donde sea.',
          price: 44900,
          stock: 85,
          imageUrl: 'https://images.unsplash.com/photo-1587145820098-23e484e69816?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Cable USB Tipo-C',
          description: 'Carga rápida y transferencia de datos para dispositivos modernos.',
          price: 29900,
          stock: 102,
          imageUrl: 'https://plus.unsplash.com/premium_photo-1669262667978-5d4aafe29dd5?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Monitor LED 24" FHD',
          description: 'Alta definición, ideal para trabajo o entretenimiento.',
          price: 549000,
          stock: 19,
          imageUrl: 'https://images.unsplash.com/photo-1547658718-1cdaa0852790?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      ];

      await this.dataSource.preloadData(mockProducts as Product[]);
      console.log('🌱 Productos de ejemplo insertados con éxito');
    } else {
      console.log(`ℹ️ La tabla ya contiene ${count} productos. Seed no ejecutado.`);
    }
  }
}

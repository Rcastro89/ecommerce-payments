import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../../../../src/infrastructure/product/controllers/product.controller';
import { GetAllProductsUseCase } from '../../../../src/application/product/get-all-products.usecase';
import { Product } from '../../../../src/domain/product/product.entity';
import { ProductRepository } from '../../../../src/domain/product/product.repository';

describe('ProductController', () => {
  let controller: ProductController;

  const mockProducts: Product[] = [
    {
      idProduct: 1,
      name: 'Producto A',
      price: 100,
      stock: 10,
      description: 'Desc A',
      imageUrl: 'https://image.com/a.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idProduct: 2,
      name: 'Producto B',
      price: 200,
      stock: 5,
      description: 'Desc B',
      imageUrl: 'https://image.com/b.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: GetAllProductsUseCase,
          useValue: mockUseCase,
        },
        {
          provide: ProductRepository,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('debería retornar una lista de productos', async () => {
    mockUseCase.execute.mockResolvedValueOnce(mockProducts);
    const result = await controller.findAll();
    expect(result).toEqual(mockProducts);
    expect(mockUseCase.execute).toHaveBeenCalled();
  });

  it('debería retornar una lista vacía si no hay productos', async () => {
    mockUseCase.execute.mockResolvedValueOnce([]);
    const result = await controller.findAll();
    expect(result).toEqual([]);
    expect(mockUseCase.execute).toHaveBeenCalled();
  });
});

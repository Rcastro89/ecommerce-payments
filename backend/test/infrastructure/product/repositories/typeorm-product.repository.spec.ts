import { TypeOrmProductRepository } from '../../../../src/infrastructure/product/repositories/typeorm-product.repository';
import { Product } from '../../../../src/domain/product/product.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TypeOrmProductRepository', () => {
    let repo: TypeOrmProductRepository;
    let repository: jest.Mocked<Repository<Product>>;

    const mockProduct = {
        idProduct: 1,
        name: 'Producto de prueba',
        price: 1000,
        stock: 50,
        description: 'Descripción del producto',
        imageUrl: 'https://example.com/image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
    } as Product;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TypeOrmProductRepository,
                {
                    provide: getRepositoryToken(Product),
                    useValue: {
                        find: jest.fn(),
                        findOneBy: jest.fn(),
                        save: jest.fn(),
                        update: jest.fn(),
                        decrement: jest.fn(),
                    },
                },
            ],
        }).compile();

        repo = module.get<TypeOrmProductRepository>(TypeOrmProductRepository);
        repository = module.get(getRepositoryToken(Product));
    });

    it('debería retornar todos los productos', async () => {
        repository.find.mockResolvedValueOnce([mockProduct]);

        const result = await repo.findAll();
        expect(result).toEqual([mockProduct]);
        expect(repository.find).toHaveBeenCalled();
    });

    it('debería encontrar un producto por ID', async () => {
        repository.findOneBy.mockResolvedValueOnce(mockProduct);

        const result = await repo.findById(1);
        expect(result).toEqual(mockProduct);
        expect(repository.findOneBy).toHaveBeenCalledWith({ idProduct: 1 });
    });

    it('debería guardar un producto', async () => {
        repository.save.mockResolvedValueOnce(mockProduct);

        const result = await repo.save(mockProduct);
        expect(result).toEqual(mockProduct);
        expect(repository.save).toHaveBeenCalledWith(mockProduct);
    });

    it('debería actualizar el stock de un producto', async () => {
        repository.update.mockResolvedValueOnce({
            raw: {},
            affected: 1,
            generatedMaps: [],
        });

        await repo.updateStock(1, 40);
        expect(repository.update).toHaveBeenCalledWith(1, { stock: 40 });
    });

    it('debería hacer preload de productos', async () => {
        repository.save.mockResolvedValueOnce(mockProduct);

        await repo.preloadData([mockProduct]);
        expect(repository.save).toHaveBeenCalledWith([mockProduct]);
    });

    it('debería actualizar múltiples stocks', async () => {
        repository.decrement.mockResolvedValue({
            raw: {},
            affected: 1,
            generatedMaps: [],
        });

        await repo.updateMultipleStock([
            { id: 1, quantity: 2 },
            { id: 2, quantity: 5 },
        ]);

        expect(repository.decrement).toHaveBeenCalledWith({ idProduct: 1 }, 'stock', 2);
        expect(repository.decrement).toHaveBeenCalledWith({ idProduct: 2 }, 'stock', 5);
        expect(repository.decrement).toHaveBeenCalledTimes(2);
    });
});

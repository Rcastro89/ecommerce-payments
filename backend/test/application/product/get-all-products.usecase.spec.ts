import { GetAllProductsUseCase } from '../../../src/application/product/get-all-products.usecase';
import { ProductRepository } from '../../../src/domain/product/product.repository';
import { Product } from '../../../src/domain/product/product.entity';

describe('GetAllProductsUseCase', () => {
    let useCase: GetAllProductsUseCase;

    const mockProductRepo: Partial<ProductRepository> = {
        findAll: jest.fn(),
    };

    beforeEach(() => {
        useCase = new GetAllProductsUseCase(mockProductRepo as ProductRepository);
    });

    it('debería retornar una lista de productos', async () => {
        const products: Product[] = [
            {
                idProduct: 1,
                name: 'Producto A',
                description: 'Descripción del producto A',
                price: 1000,
                stock: 10,
                imageUrl: 'https://example.com/img-a.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                idProduct: 2,
                name: 'Producto B',
                description: 'Descripción del producto B',
                price: 2000,
                stock: 5,
                imageUrl: 'https://example.com/img-b.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        (mockProductRepo.findAll as jest.Mock).mockResolvedValue(products);

        const result = await useCase.execute();

        expect(mockProductRepo.findAll).toHaveBeenCalled();
        expect(result).toEqual(products);
    });

    it('debería retornar una lista vacía si no hay productos', async () => {
        (mockProductRepo.findAll as jest.Mock).mockResolvedValue([]);

        const result = await useCase.execute();

        expect(mockProductRepo.findAll).toHaveBeenCalled();
        expect(result).toEqual([]);
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmTransactionItemRepository } from '../../../../src/infrastructure/transaction/repositories/typeorm-transaction-item.repository';
import { TransactionItem } from '../../../../src/domain/transaction/transaction-item.entity';
import { Transaction } from '../../../../src/domain/transaction/transaction.entity';
import { Product } from '../../../../src/domain/product/product.entity';

describe('TypeOrmTransactionItemRepository', () => {
    let repo: TypeOrmTransactionItemRepository;
    let repository: jest.Mocked<Repository<TransactionItem>>;

    const mockItemsList: TransactionItem[] = [
        {
            id_item: 1,
            transaction: {} as Transaction,
            quantity: 2,
            unit_price: 1000,
            product: {} as Product
        }];


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TypeOrmTransactionItemRepository,
                {
                    provide: getRepositoryToken(TransactionItem),
                    useValue: {
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        repo = module.get<TypeOrmTransactionItemRepository>(TypeOrmTransactionItemRepository);
        repository = module.get(getRepositoryToken(TransactionItem));
    });

    it('debería guardar los items de la transacción', async () => {
        repository.save.mockResolvedValueOnce(mockItemsList as any);

        await repo.save(mockItemsList);

        expect(repository.save).toHaveBeenCalledWith(mockItemsList);
        expect(repository.save).toHaveBeenCalledTimes(1);
    });

    it('debería lanzar un error si falla el guardado de items', async () => {
        repository.save.mockRejectedValueOnce(new Error('Error en save'));

        await expect(repo.save(mockItemsList)).rejects.toThrow('Error en save');
        expect(repository.save).toHaveBeenCalledWith(mockItemsList);
    });
});
